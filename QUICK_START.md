# 🚀 STACK Kids Bank - Quick Start

## ⚡ Test the Fixes (5 minutes)

### 1. Start Backend
```bash
cd stack
mvn spring-boot:run
```
Wait for "Started KidsBankApiApplication"

### 2. Start Frontend
```bash
cd stack-family-finance
npm install
npm run dev
```
Open http://localhost:5173

### 3. Test Parent Flow
1. Click "Register"
2. Username: `parent1`, Password: `password123`, Role: PARENT
3. Login
4. Create family: "Test Family"
5. Click "Generate Invite Code"
6. Copy the code (e.g., "ABC12345")

### 4. Test Child Flow
1. Open incognito window
2. Go to http://localhost:5173
3. Register: `child1`, `password123`, CHILD
4. Login
5. Go to Family page
6. Paste invite code
7. Join family

### 5. Verify Success ✅
- No 401 errors
- No 403 errors
- Parent sees child in family
- Child sees family info
- All pages load correctly

---

## 🖥️ Build Desktop App (10 minutes)

```bash
cd stack-family-finance

# Install dependencies
npm install -D electron electron-builder electron-vite

# Build Windows installer
npm run electron:dist:win
```

Your `.exe` will be in `stack-family-finance/release/`

---

## 📱 Build Mobile App (20 minutes)

```bash
cd stack-family-finance

# Install Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/local-notifications

# Initialize (use defaults)
npm run mobile:init

# Add Android
npm run mobile:add:android

# Build and sync
npm run mobile:build

# Open in Android Studio
npm run mobile:open:android
```

In Android Studio:
1. Wait for Gradle sync
2. Build > Build APK
3. Find APK in `android/app/build/outputs/apk/`

---

## 🔧 Common Issues

### Backend won't start
- Check PostgreSQL is running
- Verify database credentials in `application.yml`
- Ensure port 8080 is free

### Frontend shows 401 errors
- Make sure backend is running
- Check `.env` has correct API URL
- Clear browser cache and localStorage

### Desktop build fails
- Run `npm install -D electron electron-builder electron-vite`
- Check Node.js version (18+)
- Try `npm run electron:build` first

### Mobile build fails
- Install Android Studio
- Install Java 17
- Run `npm run mobile:sync` again

---

## 📝 Environment Setup

### Backend (.env or application.yml)
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/kidsbank
    username: postgres
    password: your_password

app:
  jwt:
    secret: "CHANGE_THIS_TO_SECURE_RANDOM_STRING_64_CHARS_MIN"
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:8080
```

---

## 📚 Full Documentation

- `COMPLETE_SOLUTION.md` - Overview of all fixes
- `FIXES_APPLIED.md` - Technical details
- `SETUP_INSTRUCTIONS.md` - Detailed setup guide
- `DEPLOYMENT.md` - Production deployment

---

## ✅ What's Fixed

1. ✅ Authentication (401/403 errors)
2. ✅ Parent-child relationship
3. ✅ Desktop support (.exe)
4. ✅ Mobile support (Android)
5. ✅ Notifications
6. ✅ Touch-optimized UI

---

## 🎯 Next Steps

1. Test web version ← Start here!
2. Build desktop if needed
3. Build mobile if needed
4. Deploy to production

Need help? Check the full documentation files!
