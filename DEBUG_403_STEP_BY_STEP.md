# Debug 403 Errors Step by Step

## 🔍 Current Status
You're still getting 403 errors on:
- `https://stack.polito.uz/api/family/me`
- `https://stack.polito.uz/api/tasks/parent`
- `https://stack.polito.uz/api/users/profile`
- `https://stack.polito.uz/api/dashboard/parent`

## 🚨 Critical Issue
The code changes I made are only in your local files, but your server is still running the old code!

## 🛠️ Step-by-Step Fix

### Step 1: Check Server Status
```bash
# SSH to your server
ssh your-server

# Check if PM2 is running
pm2 list

# Check current logs
pm2 logs stack --lines 20
```

### Step 2: Deploy Updated Code to Server
```bash
# On your server, navigate to your project
cd /path/to/your/project/stack

# Pull latest changes (if using git)
git pull origin main

# OR upload the updated CurrentUserArgumentResolver.java file manually

# Restart PM2 to reload the code
pm2 restart stack
```

### Step 3: Verify Database Schema
```bash
# Connect to PostgreSQL
sudo -u postgres psql -d kidsbank

# Check if enabled column exists
\d users

# If column doesn't exist, add it:
ALTER TABLE users ADD COLUMN enabled BOOLEAN NOT NULL DEFAULT true;

# Exit
\q
```

### Step 4: Test Authentication Flow
```bash
# Test basic endpoint
curl https://stack.polito.uz/

# Test login (replace with real credentials)
curl -X POST https://stack.polito.uz/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"your_username","password":"your_password"}'
```

## 🔧 Quick Debug Commands

### Check if JWT is being sent correctly:
Open browser console and run:
```javascript
// Check if token exists
console.log(localStorage.getItem('token'));

// Check if token is being sent in requests
// Look at Network tab in DevTools for Authorization header
```

### Check server logs for authentication errors:
```bash
pm2 logs stack --lines 50 | grep -i "auth\|403\|error"
```

### Test JWT parsing:
```bash
# On your server, check if JWT service is working
pm2 logs stack | grep -i "jwt\|token"
```

## 🎯 Most Likely Issues

### 1. Code Not Deployed
**Problem**: The CurrentUserArgumentResolver fix is not on your server
**Solution**: Upload the updated file and restart PM2

### 2. Database Schema Missing
**Problem**: `enabled` column doesn't exist in server database
**Solution**: Add the column as shown above

### 3. JWT Token Issues
**Problem**: Frontend token might be invalid or expired
**Solution**: Clear localStorage and login again

### 4. CORS Issues
**Problem**: Server might be rejecting requests from your domain
**Solution**: Check CORS configuration

## 🚀 Quick Fix Script

Create this script on your server:

```bash
#!/bin/bash
echo "🔧 Fixing 403 errors..."

# Add database column if missing
sudo -u postgres psql -d kidsbank -c "ALTER TABLE users ADD COLUMN IF NOT EXISTS enabled BOOLEAN NOT NULL DEFAULT true;"

# Restart application
pm2 restart stack

# Wait for restart
sleep 5

# Test endpoint
curl -I https://stack.polito.uz/api/auth/login

echo "✅ Fix applied. Check pm2 logs stack for details."
```

## 🔍 Debugging Steps

### 1. Check if CurrentUserArgumentResolver is updated:
```bash
# On your server, check the file content
cat /path/to/your/project/stack/src/main/java/com/kidsbank/api/security/CurrentUserArgumentResolver.java | grep -A 10 "Long userId"
```

### 2. Check database schema:
```bash
sudo -u postgres psql -d kidsbank -c "\d users"
```

### 3. Check application logs:
```bash
pm2 logs stack --lines 100
```

### 4. Test with curl:
```bash
# Get a JWT token first
TOKEN=$(curl -s -X POST https://stack.polito.uz/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"your_username","password":"your_password"}' | jq -r '.data.token')

# Test protected endpoint
curl -H "Authorization: Bearer $TOKEN" https://stack.polito.uz/api/family/me
```

## ⚡ Immediate Action Required

1. **Upload the fixed CurrentUserArgumentResolver.java to your server**
2. **Add the database column**
3. **Restart PM2**
4. **Clear browser cache/localStorage and login again**

The 403 errors will persist until these changes are deployed to your server!