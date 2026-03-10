# Fix 403 Forbidden Errors

## 🔍 Root Cause Analysis

The 403 errors are happening because:

1. **Database Schema Issue**: The `enabled` column is missing from the `users` table
2. **Authentication Issue**: The `CurrentUserArgumentResolver` was looking up users by username instead of userId
3. **JWT Token Issue**: The JWT filter stores userId as principal, but resolver expected username

## 🛠️ Fixes Applied

### 1. Fixed CurrentUserArgumentResolver ✅
**File**: `stack/src/main/java/com/kidsbank/api/security/CurrentUserArgumentResolver.java`

**Problem**: The resolver was trying to find users by username, but JWT filter stores userId as principal.

**Solution**: Updated to parse userId from authentication principal:
```java
// The JWT filter stores userId as the principal, not username
String userIdStr = authentication.getName();
try {
    Long userId = Long.parseLong(userIdStr);
    return userRepository.findById(userId).orElse(null);
} catch (NumberFormatException e) {
    // Fallback to username lookup if parsing fails
    return userRepository.findByUsername(userIdStr).orElse(null);
}
```

### 2. Database Schema Fix Required
**Problem**: Missing `enabled` column in `users` table on server.

**Solution**: Add the missing column to your server database:

```sql
-- Connect to your database
sudo -u postgres psql -d kidsbank

-- Add the missing column
ALTER TABLE users ADD COLUMN enabled BOOLEAN NOT NULL DEFAULT true;

-- Verify the column was added
\d users

-- Exit
\q
```

## 🚀 Deployment Steps

### 1. Apply Database Fix
```bash
# Connect to PostgreSQL on your server
sudo -u postgres psql -d kidsbank

# Add missing column
ALTER TABLE users ADD COLUMN enabled BOOLEAN NOT NULL DEFAULT true;

# Exit
\q
```

### 2. Restart Application
```bash
# Restart PM2 process
pm2 restart stack

# Check logs
pm2 logs stack
```

### 3. Test Endpoints
```bash
# Test basic endpoint
curl http://localhost:8080/

# Test authentication (replace with real credentials)
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"your_username","password":"your_password"}'

# Test protected endpoint (replace TOKEN with actual JWT)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:8080/api/family/me
```

## 🔧 Verification

After applying fixes, these endpoints should work:
- ✅ `/api/family/me`
- ✅ `/api/tasks/parent`
- ✅ `/api/tasks/child`
- ✅ Dashboard endpoints
- ✅ User profile endpoints

## 🛡️ Security Flow Explanation

1. **Login**: User provides username/password
2. **JWT Creation**: Server creates JWT with userId, username, role
3. **JWT Storage**: Frontend stores JWT token
4. **Request**: Frontend sends JWT in Authorization header
5. **JWT Filter**: Extracts userId from JWT, sets as authentication principal
6. **Controller**: Uses `@CurrentUser` annotation to get current user
7. **Resolver**: Looks up user by userId (not username)

## 📊 Expected Results

After fixes:
- ✅ No more 403 Forbidden errors
- ✅ Dashboard loads properly
- ✅ Family endpoints work
- ✅ Task endpoints work
- ✅ User profile works

## 🚨 If Issues Persist

1. **Check JWT Token**:
```bash
# In browser console, check if token exists
localStorage.getItem('token')
```

2. **Check Server Logs**:
```bash
pm2 logs stack --lines 50
```

3. **Verify Database**:
```sql
-- Check if enabled column exists
\d users

-- Check if users exist
SELECT id, username, role, enabled FROM users LIMIT 5;
```

4. **Test Authentication Flow**:
```bash
# Test login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'
```

The fixes should resolve all 403 errors and restore full functionality to your application! 🎉