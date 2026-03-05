# 🐛 Debug Authentication Issue

## Problem:
- 403 errors on `/api/family/me` and `/api/family/create`
- Backend is running
- User is logged in

## Likely Causes:

### 1. Token Not Being Sent
Check browser console localStorage:
```javascript
localStorage.getItem('stack_token')
localStorage.getItem('stack_user')
```

### 2. Wrong Role in Token
The user might be registered as CHILD but trying to access PARENT endpoints.

### 3. Token Format Issue
Check if token starts with "Bearer " or just the token.

---

## Quick Debug Steps:

### Step 1: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Type:
```javascript
console.log('Token:', localStorage.getItem('stack_token'));
console.log('User:', localStorage.getItem('stack_user'));
```

### Step 2: Check Network Tab
1. Open Network tab in DevTools
2. Try to create family
3. Click on the failed request
4. Check "Headers" tab
5. Look for "Authorization" header
6. Should be: `Bearer <your-token>`

### Step 3: Decode JWT Token
1. Copy your token from localStorage
2. Go to https://jwt.io
3. Paste token
4. Check the payload:
   - `sub` should be user ID
   - `role` should be "PARENT" for parent dashboard
   - `username` should be your username

---

## Common Issues & Fixes:

### Issue 1: No Token in Request
**Symptom:** 401 Unauthorized
**Fix:** Login again

### Issue 2: Wrong Role
**Symptom:** 403 Forbidden on parent endpoints
**Cause:** Logged in as CHILD but trying to access PARENT features
**Fix:** 
1. Logout
2. Login with PARENT account
3. Or register new PARENT account

### Issue 3: Token Expired
**Symptom:** 401 Unauthorized after some time
**Fix:** Login again (tokens expire after 60 minutes)

---

## Test Flow:

### Register as PARENT:
1. Go to Register page
2. Username: `testparent`
3. Password: `password123`
4. **Role: PARENT** ← IMPORTANT!
5. Click Register

### Login as PARENT:
1. Go to Login page
2. Username: `testparent`
3. Password: `password123`
4. Click Login
5. Should redirect to Parent Dashboard

### Create Family:
1. Should be on Parent Dashboard
2. Enter family name
3. Click Create
4. Should work without 403 error

---

## Manual Test:

### Test with curl:
```bash
# 1. Login and get token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testparent","password":"password123"}'

# Copy the token from response

# 2. Test family endpoint
curl -X GET http://localhost:8080/api/family/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Solution:

### Most Likely Issue: Wrong Role

You're probably logged in as CHILD but trying to access PARENT endpoints.

**Fix:**
1. Click Logout (or clear localStorage)
2. Register NEW account with PARENT role
3. Login with that account
4. Try creating family again

### Clear Everything and Start Fresh:
```javascript
// In browser console:
localStorage.clear();
location.reload();
```

Then:
1. Register as PARENT
2. Login
3. Create family
4. Should work!

---

## Check Backend Logs:

Look for these in backend console:
- JWT parsing errors
- Role mismatch errors
- Authentication failures

If you see "Access Denied" or "Forbidden", it means:
- Token is valid
- User is authenticated
- But user doesn't have the right ROLE

---

## Quick Fix Script:

Run this in browser console to check everything:
```javascript
const token = localStorage.getItem('stack_token');
const user = JSON.parse(localStorage.getItem('stack_user') || '{}');

console.log('=== AUTH DEBUG ===');
console.log('Token exists:', !!token);
console.log('Token length:', token?.length);
console.log('User:', user);
console.log('User role:', user.role);
console.log('Expected role for parent dashboard:', 'PARENT');
console.log('Role matches:', user.role === 'PARENT');

if (user.role !== 'PARENT') {
  console.error('❌ PROBLEM: You are logged in as', user.role, 'but trying to access PARENT features!');
  console.log('✅ SOLUTION: Logout and login with a PARENT account');
} else {
  console.log('✅ Role is correct');
}
```

---

## Expected Behavior:

### For PARENT users:
- ✅ Can access `/api/family/create`
- ✅ Can access `/api/family/me`
- ✅ Can access `/api/family/{id}/invite`
- ✅ Can access `/api/family/{id}/members`
- ❌ Cannot access child-only endpoints

### For CHILD users:
- ❌ Cannot access `/api/family/create` (403)
- ✅ Can access `/api/family/me`
- ✅ Can access `/api/family/join`
- ❌ Cannot access parent-only endpoints

---

## Most Common Mistake:

**You registered as CHILD but are trying to use parent features!**

The app redirects based on role:
- PARENT → `/parent/dashboard`
- CHILD → `/child/dashboard`

But if you manually navigate to `/parent/dashboard` as a CHILD, you'll get 403 errors.

**Solution:** Register and login as PARENT to use parent features!
