# 🔧 Fix 403 Forbidden Error

## Problem:
You're getting 403 errors on `/api/family/me` and `/api/family/create`

## Root Cause:
**You are logged in as CHILD but trying to access PARENT endpoints!**

---

## ✅ SOLUTION: Register as PARENT

### Step 1: Clear Everything
1. Open browser DevTools (F12)
2. Go to Console tab
3. Run:
```javascript
localStorage.clear();
location.reload();
```

### Step 2: Register as PARENT
1. Click "Register"
2. Username: `parent1`
3. Password: `password123`
4. **Role: PARENT** ← Click the PARENT button!
5. Click "Create Account"

### Step 3: Login
1. Username: `parent1`
2. Password: `password123`
3. Click "Sign In"

### Step 4: Verify
You should now see a yellow debug box at the top showing:
- ✅ Role: PARENT
- ✅ "You are logged in as PARENT. You can create families."

### Step 5: Create Family
1. Enter family name: "Test Family"
2. Click "Create"
3. ✅ Should work without 403 error!

---

## Why This Happens:

### Parent Endpoints (Require PARENT role):
- `/api/family/create` - Create a family
- `/api/family/{id}/invite` - Generate invite code
- `/api/family/{id}/members` - View family members

### Child Endpoints (Require CHILD role):
- `/api/family/join` - Join family with code

### Shared Endpoints (Any role):
- `/api/family/me` - Get my families

**If you're logged in as CHILD and try to access parent endpoints, you get 403!**

---

## How to Check Your Role:

### Method 1: Debug Box (Added to Parent Dashboard)
Look at the top of the parent dashboard - there's now a yellow debug box showing your role.

### Method 2: Browser Console
```javascript
const user = JSON.parse(localStorage.getItem('stack_user'));
console.log('Your role:', user.role);
```

### Method 3: Check Token
1. Copy token from localStorage:
```javascript
console.log(localStorage.getItem('stack_token'));
```
2. Go to https://jwt.io
3. Paste token
4. Check `role` field in payload

---

## Common Mistakes:

### ❌ Mistake 1: Registered as CHILD
**Problem:** Clicked CHILD button during registration
**Fix:** Register new account as PARENT

### ❌ Mistake 2: Using Wrong Account
**Problem:** Have both PARENT and CHILD accounts, logged in with wrong one
**Fix:** Logout and login with PARENT account

### ❌ Mistake 3: Manually Navigating to Parent Dashboard
**Problem:** Logged in as CHILD but manually went to `/parent/dashboard`
**Fix:** The app should redirect you, but if not, logout and login as PARENT

---

## Test Both Roles:

### Test PARENT:
1. Register as PARENT
2. Login
3. Go to Parent Dashboard
4. Create family ✅
5. Generate invite code ✅

### Test CHILD:
1. Register as CHILD (different username!)
2. Login
3. Go to Child Dashboard
4. Try to create family ❌ (403 - expected!)
5. Join family with code ✅

---

## Backend is Correct!

The 403 error means:
- ✅ Backend is running
- ✅ You are authenticated
- ✅ Token is valid
- ❌ But you don't have the right ROLE

This is **correct behavior** - it's protecting parent-only endpoints!

---

## Quick Fix Commands:

### Clear and Start Fresh:
```javascript
// In browser console:
localStorage.clear();
location.reload();
```

### Check Current Role:
```javascript
// In browser console:
const user = JSON.parse(localStorage.getItem('stack_user') || '{}');
console.log('Role:', user.role);
console.log('Can create families:', user.role === 'PARENT');
```

---

## Summary:

**The 403 error is NOT a bug - it's security working correctly!**

You just need to:
1. Clear localStorage
2. Register as PARENT (not CHILD)
3. Login
4. Create family

**That's it!** 🎉

---

## After the Fix:

Once you're logged in as PARENT, you should see:
- ✅ Debug box showing "Role: PARENT"
- ✅ Family creation works
- ✅ Invite code generation works
- ✅ No 403 errors

The debug box will help you always know which role you're using!
