# Backend 403 Fix - Simple Solution

## 🎯 The Real Problem
Different controllers use different ways to get the user ID:
- Some use `@CurrentUser` (which we fixed)
- Others use `Authentication.getPrincipal()` directly (like DashboardController)
- The JWT filter and these methods are inconsistent

## 🛠️ Simple Fix - Make Everything Consistent

### Option 1: Fix the JWT Filter (Recommended)
Edit the JWT filter to store username instead of userId as principal:

```bash
# Edit JwtAuthFilter.java on your server
nano ~/stack/stack/src/main/java/com/kidsbank/api/security/JwtAuthFilter.java
```

Find this line:
```java
var authentication = new UsernamePasswordAuthenticationToken(userId, null, authorities);
```

Change it to:
```java
var authentication = new UsernamePasswordAuthenticationToken(username, null, authorities);
```

### Option 2: Fix All Controllers to Use @CurrentUser
Replace all `Authentication` parameters with `@CurrentUser User currentUser`.

## 🚀 Quick Fix Script

Run this on your server:

```bash
# Backup the original file
cp ~/stack/stack/src/main/java/com/kidsbank/api/security/JwtAuthFilter.java ~/JwtAuthFilter.java.backup

# Apply the fix
sed -i 's/new UsernamePasswordAuthenticationToken(userId, null, authorities)/new UsernamePasswordAuthenticationToken(username, null, authorities)/' ~/stack/stack/src/main/java/com/kidsbank/api/security/JwtAuthFilter.java

# Restart PM2
pm2 restart stack

# Test the fix
sleep 5
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJraWRzYmFuay1hcGkiLCJzdWIiOiIxIiwidXNlcm5hbWUiOiJwYXJlbnQiLCJyb2xlIjoiUEFSRU5UIiwiaWF0IjoxNzczMTQ2NzgyLCJleHAiOjE7NzMxNTAzODJ9.OLOMQuND47gvj9VwqQ7OYKPNXQaXi0FU2xo7mrrmrrE" https://stack.polito.uz/api/dashboard/parent
```

## 🔧 Manual Fix

If the script doesn't work, edit the file manually:

```bash
nano ~/stack/stack/src/main/java/com/kidsbank/api/security/JwtAuthFilter.java
```

Find this section:
```java
var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role));
// Store userId as principal so it's accessible in controllers
var authentication = new UsernamePasswordAuthenticationToken(userId, null, authorities);
```

Change it to:
```java
var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role));
// Store username as principal so it's accessible in controllers
var authentication = new UsernamePasswordAuthenticationToken(username, null, authorities);
```

Then restart PM2:
```bash
pm2 restart stack
```

## ✅ Why This Fixes It

1. **DashboardController** expects `auth.getPrincipal()` to be a string (username)
2. **FamilyController** expects `auth.getPrincipal()` to be a string (username) 
3. **CurrentUserArgumentResolver** now looks up by username (our previous fix)
4. **JWT Filter** will now store username as principal (this fix)

Everything will be consistent and the 403 errors will disappear!

## 🧪 Test After Fix

```bash
# Test dashboard endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" https://stack.polito.uz/api/dashboard/parent

# Test family endpoint  
curl -H "Authorization: Bearer YOUR_TOKEN" https://stack.polito.uz/api/family/me

# Test tasks endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" https://stack.polito.uz/api/tasks/parent
```

All should return data instead of 403 errors!