# FINAL 403 FIX - Step by Step

## 🚨 Critical Issue
The CurrentUserArgumentResolver fix is NOT deployed to your server yet!

## 🔍 Verify Current Server Code

Run this on your server to check if the fix is deployed:

```bash
# Check if the fix is in your server code
grep -A 15 "Long userId = Long.parseLong" ~/stack/stack/src/main/java/com/kidsbank/api/security/CurrentUserArgumentResolver.java
```

If this returns nothing, the fix is NOT on your server!

## 🛠️ Deploy the Fix NOW

### Step 1: Upload the Fixed File
You need to replace the CurrentUserArgumentResolver.java file on your server with the fixed version.

**Option A: Copy the file manually**
```bash
# On your local machine, copy the fixed file to server
scp stack/src/main/java/com/kidsbank/api/security/CurrentUserArgumentResolver.java \
  your-server:~/stack/stack/src/main/java/com/kidsbank/api/security/
```

**Option B: Edit directly on server**
```bash
# SSH to your server
ssh your-server

# Edit the file
nano ~/stack/stack/src/main/java/com/kidsbank/api/security/CurrentUserArgumentResolver.java
```

Replace the `resolveArgument` method with this:

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

    // The JWT filter stores userId as the principal, not username
    String userIdStr = authentication.getName();
    try {
        Long userId = Long.parseLong(userIdStr);
        return userRepository.findById(userId).orElse(null);
    } catch (NumberFormatException e) {
        // Fallback to username lookup if parsing fails
        return userRepository.findByUsername(userIdStr).orElse(null);
    }
}
```

### Step 2: Restart PM2
```bash
# Restart the application to load new code
pm2 restart stack

# Check logs
pm2 logs stack --lines 20
```

### Step 3: Add Database Column (if not done)
```bash
# Add the enabled column
sudo -u postgres psql -d kidsbank -c "ALTER TABLE users ADD COLUMN IF NOT EXISTS enabled BOOLEAN NOT NULL DEFAULT true;"
```

### Step 4: Test the Fix
```bash
# Test with the working JWT token
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJraWRzYmFuay1hcGkiLCJzdWIiOiIxIiwidXNlcm5hbWUiOiJwYXJlbnQiLCJyb2xlIjoiUEFSRU5UIiwiaWF0IjoxNzczMTQ2NzgyLCJleHAiOjE3NzMxNTAzODJ9.OLOMQuND47gvj9VwqQ7OYKPNXQaXi0FU2xo7mrrmrrE" \
  https://stack.polito.uz/api/family/me
```

## 🎯 Alternative Quick Fix

If you can't deploy the file, here's a temporary workaround - modify the JWT filter to store username instead of userId:

**Edit JwtAuthFilter.java on your server:**
```java
// In JwtAuthFilter.java, change this line:
var authentication = new UsernamePasswordAuthenticationToken(userId, null, authorities);

// To this:
var authentication = new UsernamePasswordAuthenticationToken(username, null, authorities);
```

Then restart PM2.

## 🔧 Complete Fix Script

Create this script on your server and run it:

```bash
#!/bin/bash
echo "🔧 Applying complete 403 fix..."

# Add database column
sudo -u postgres psql -d kidsbank -c "ALTER TABLE users ADD COLUMN IF NOT EXISTS enabled BOOLEAN NOT NULL DEFAULT true;"

# Backup current file
cp ~/stack/stack/src/main/java/com/kidsbank/api/security/CurrentUserArgumentResolver.java ~/CurrentUserArgumentResolver.java.backup

# Apply the fix (you need to paste the fixed code here)
cat > ~/stack/stack/src/main/java/com/kidsbank/api/security/CurrentUserArgumentResolver.java << 'EOF'
package com.kidsbank.api.security;

import com.kidsbank.api.user.User;
import com.kidsbank.api.user.UserRepository;
import org.springframework.core.MethodParameter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

/**
 * Argument resolver for @CurrentUser annotation.
 * Automatically injects the current authenticated user into controller methods.
 */
@Component
public class CurrentUserArgumentResolver implements HandlerMethodArgumentResolver {

    private final UserRepository userRepository;

    public CurrentUserArgumentResolver(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(CurrentUser.class) && 
               parameter.getParameterType().equals(User.class);
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, 
                                ModelAndViewContainer mavContainer,
                                NativeWebRequest webRequest, 
                                WebDataBinderFactory binderFactory) throws Exception {
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        // The JWT filter stores userId as the principal, not username
        String userIdStr = authentication.getName();
        try {
            Long userId = Long.parseLong(userIdStr);
            return userRepository.findById(userId).orElse(null);
        } catch (NumberFormatException e) {
            // Fallback to username lookup if parsing fails
            return userRepository.findByUsername(userIdStr).orElse(null);
        }
    }
}
EOF

# Restart PM2
pm2 restart stack

echo "✅ Fix applied! Check pm2 logs stack"
```

## 🚀 After the Fix

1. Clear browser localStorage
2. Login again with: username=`parent`, password=`123456`
3. The 403 errors should be gone!

The issue is definitely that the code fix is not deployed to your server yet!