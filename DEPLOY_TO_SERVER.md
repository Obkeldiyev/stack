# Deploy Backend Fixes to Server

## 🚀 Steps to Deploy

### 1. Push Changes to Git
```bash
# Add all changes
git add .

# Commit the fixes
git commit -m "Fix 403 authentication errors - JWT filter and controllers"

# Push to your repository
git push origin main
```

### 2. Pull Changes on Server
```bash
# SSH to your server
ssh your-server

# Navigate to project directory
cd ~/stack/stack

# Pull latest changes
git pull origin main
```

### 3. Add Database Column (if not done)
```bash
# Add the enabled column to users table
sudo -u postgres psql -d kidsbank -c "ALTER TABLE users ADD COLUMN IF NOT EXISTS enabled BOOLEAN NOT NULL DEFAULT true;"
```

### 4. Restart PM2
```bash
# Restart the application
pm2 restart stack

# Wait for startup
sleep 10

# Check logs
pm2 logs stack --lines 20
```

### 5. Test the Fix
```bash
# Get a fresh JWT token
curl -X POST https://stack.polito.uz/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"parent","password":"123456"}'

# Copy the accessToken from the response and test protected endpoints
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" https://stack.polito.uz/api/family/me
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" https://stack.polito.uz/api/tasks/parent
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" https://stack.polito.uz/api/users/profile
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" https://stack.polito.uz/api/dashboard/parent
```

## ✅ What Was Fixed

1. **JwtAuthFilter**: Now stores `username` as principal instead of `userId`
2. **CurrentUserArgumentResolver**: Looks up user by username consistently
3. **DashboardController**: Added UserRepository and fixed authUserId method
4. **FamilyController**: Added UserRepository and fixed authUserId method

## 🎯 Expected Result

After deployment:
- All 403 Forbidden errors should disappear
- Dashboard should load properly
- Family endpoints should work
- Tasks endpoints should work
- User profile should work

## 🧪 Frontend Testing

After server deployment:
1. Clear browser localStorage: `localStorage.removeItem('token')`
2. Refresh the page
3. Login again with: username=`parent`, password=`123456`
4. All endpoints should now work without 403 errors!

The authentication flow is now consistent across all controllers!