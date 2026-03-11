# Complete Backend 403 Fix

## 🚨 The Problem
- Login/Register works ✅
- All protected endpoints return 403 ❌
- JWT token is created but not being processed correctly

## 🛠️ Complete Fix - Run These Commands on Your Server

### Step 1: Fix JWT Filter (Main Issue)
```bash
# Edit the JWT filter
nano ~/stack/stack/src/main/java/com/kidsbank/api/security/JwtAuthFilter.java
```

Replace the entire `doFilter` method with this:

```java
@Override
public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
    throws IOException, ServletException {

  HttpServletRequest request = (HttpServletRequest) req;
  String auth = request.getHeader("Authorization");

  if (auth != null && auth.startsWith("Bearer ")) {
    String token = auth.substring(7);
    try {
      Jws<Claims> parsed = jwtService.parse(token);
      Claims c = parsed.getPayload();

      String userId = c.getSubject();
      String username = c.get("username", String.class);
      String role = c.get("role", String.class);

      var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role));
      // Store username as principal for consistency with all controllers
      var authentication = new UsernamePasswordAuthenticationToken(username, null, authorities);
      SecurityContextHolder.getContext().setAuthentication(authentication);
    } catch (Exception e) {
      // Log the error for debugging
      System.err.println("JWT parsing failed: " + e.getMessage());
      SecurityContextHolder.clearContext();
    }
  }

  chain.doFilter(req, res);
}
```

### Step 2: Fix CurrentUserArgumentResolver
```bash
# Edit the resolver
nano ~/stack/stack/src/main/java/com/kidsbank/api/security/CurrentUserArgumentResolver.java
```

Replace the `resolveArgument` method with:

```java
@Override
public Object resolveArgument(MethodParameter parameter, 
                            ModelAndViewContainer mavContainer,
                            NativeWebRequest webRequest, 
                            WebDataBinderFactory binderFactory) throws Exception {
    
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    
    if (authentication == null || !authentication.isAuthenticated()) {
        return null;
    }

    // Get username from authentication principal
    String username = authentication.getName();
    return userRepository.findByUsername(username).orElse(null);
}
```

### Step 3: Fix DashboardController authUserId method
```bash
# Edit the dashboard controller
nano ~/stack/stack/src/main/java/com/kidsbank/api/bank/DashboardController.java
```

Replace the `authUserId` method with:

```java
private Long authUserId(org.springframework.security.core.Authentication auth) {
    String username = auth.getName();
    // Look up user by username to get ID
    return userRepository.findByUsername(username)
        .map(user -> user.getId())
        .orElseThrow(() -> new RuntimeException("User not found: " + username));
}
```

And add this import at the top:
```java
import com.kidsbank.api.user.UserRepository;
```

And add this field to the class:
```java
private final UserRepository userRepository;
```

Update the constructor to include UserRepository:
```java
public DashboardController(AccountRepository accountRepo, 
                         TransactionRepository transactionRepo,
                         GoalRepository goalRepo, 
                         FamilyMemberRepository familyMemberRepo,
                         TaskRepository taskRepo,
                         UserRepository userRepository) {
    this.accountRepo = accountRepo;
    this.transactionRepo = transactionRepo;
    this.goalRepo = goalRepo;
    this.familyMemberRepo = familyMemberRepo;
    this.taskRepo = taskRepo;
    this.userRepository = userRepository;
}
```

### Step 4: Fix FamilyController authUserId method
```bash
# Edit the family controller
nano ~/stack/stack/src/main/java/com/kidsbank/api/family/FamilyController.java
```

Replace the `authUserId` method with:

```java
private Long authUserId(org.springframework.security.core.Authentication auth) {
    String username = auth.getName();
    // Look up user by username to get ID
    return service.getUserIdByUsername(username);
}
```

### Step 5: Add method to FamilyService
```bash
# Edit the family service
nano ~/stack/stack/src/main/java/com/kidsbank/api/family/FamilyService.java
```

Add this method:

```java
public Long getUserIdByUsername(String username) {
    return userRepo.findByUsername(username)
        .map(user -> user.getId())
        .orElseThrow(() -> new RuntimeException("User not found: " + username));
}
```

### Step 6: Add Database Column (if not done)
```bash
# Add the enabled column
sudo -u postgres psql -d kidsbank -c "ALTER TABLE users ADD COLUMN IF NOT EXISTS enabled BOOLEAN NOT NULL DEFAULT true;"
```

### Step 7: Restart Application
```bash
# Restart PM2
pm2 restart stack

# Wait for startup
sleep 10

# Check logs
pm2 logs stack --lines 20
```

## 🧪 Test the Fix

```bash
# Get a fresh token
TOKEN=$(curl -s -X POST https://stack.polito.uz/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"parent","password":"123456"}' | \
  grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

echo "Token: $TOKEN"

# Test protected endpoints
curl -H "Authorization: Bearer $TOKEN" https://stack.polito.uz/api/family/me
curl -H "Authorization: Bearer $TOKEN" https://stack.polito.uz/api/tasks/parent
curl -H "Authorization: Bearer $TOKEN" https://stack.polito.uz/api/users/profile
curl -H "Authorization: Bearer $TOKEN" https://stack.polito.uz/api/dashboard/parent
```

## 🎯 What This Fixes

1. **JWT Filter**: Now properly stores username as principal
2. **CurrentUserArgumentResolver**: Looks up user by username consistently
3. **DashboardController**: Gets user ID by looking up username
4. **FamilyController**: Gets user ID by looking up username
5. **Database**: Has the required enabled column

## ✅ Expected Result

After these fixes:
- All 403 errors should disappear
- Dashboard should load
- Family endpoints should work
- Tasks should work
- User profile should work

The key was making ALL controllers use the same method to get user information from the JWT token!