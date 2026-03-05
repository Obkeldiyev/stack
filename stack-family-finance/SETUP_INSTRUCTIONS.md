# STACK Kids Bank - Complete Setup Instructions

## 🔧 Backend Setup (Spring Boot)

### 1. Install Prerequisites
- Java 17 or higher
- PostgreSQL 14+
- Maven 3.8+

### 2. Setup Database
```sql
CREATE DATABASE kidsbank;
CREATE USER kidsbank_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE kidsbank TO kidsbank_user;
```

### 3. Configure Backend
Edit `stack/src/main/resources/application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/kidsbank
    username: kidsbank_user
    password: your_password

app:
  jwt:
    secret: "CHANGE_THIS_TO_A_SECURE_RANDOM_STRING_AT_LEAST_64_CHARACTERS_LONG"
```

### 4. Run Backend
```bash
cd stack
mvn clean install
mvn spring-boot:run
```

Backend will run on `http://localhost:8080`

---

## 🌐 Frontend Setup (Web)

### 1. Install Dependencies
```bash
cd stack-family-finance
npm install
```

### 2. Configure Environment
Create `.env` file:
```
VITE_API_BASE_URL=http://localhost:8080
```

### 3. Run Development Server
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

---

## 🖥️ Desktop Setup (Windows .exe)

### 1. Install Electron Dependencies
```bash
npm install -D electron electron-builder electron-vite
```

### 2. Build Desktop App
```bash
# Development mode
npm run electron:dev

# Build installer
npm run electron:dist:win
```

### 3. Find Your .exe
The installer will be in `stack-family-finance/release/` folder:
- `STACK Kids Bank-Setup-1.0.0.exe`

---

## 📱 Mobile Setup (Android)

### 1. Install Prerequisites
- Node.js 18+
- Android Studio
- Java 17 (for Android builds)

### 2. Install Capacitor
```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/local-notifications @capacitor/push-notifications
```

### 3. Initialize Capacitor
```bash
npm run mobile:init
# When prompted:
# App name: STACK Kids Bank
# App ID: com.kidsbank.stack
# Web directory: dist
```

### 4. Add Android Platform
```bash
npm run mobile:add:android
```

### 5. Build and Sync
```bash
npm run mobile:build
```

### 6. Open in Android Studio
```bash
npm run mobile:open:android
```

### 7. Build APK in Android Studio
1. Wait for Gradle sync to complete
2. Build > Build Bundle(s) / APK(s) > Build APK(s)
3. Find APK in `android/app/build/outputs/apk/debug/app-debug.apk`

### 8. For Production Release
1. Build > Generate Signed Bundle / APK
2. Create or use existing keystore
3. Select "release" build variant
4. APK will be in `android/app/build/outputs/apk/release/`

---

## 🔐 Authentication Issues - FIXED!

### What Was Wrong:
1. ❌ Backend returned `{accessToken, tokenType, userId, username, role}`
2. ❌ Frontend expected `{token, user: {id, username, role}}`
3. ❌ JWT filter stored userId in wrong place
4. ❌ Controllers couldn't access userId properly

### What's Fixed:
1. ✅ Backend now returns `{token, user: {id, username, role}}`
2. ✅ JWT filter stores userId as principal
3. ✅ All controllers use `auth.getPrincipal()` to get userId
4. ✅ Frontend handles ApiResponse wrapper automatically
5. ✅ CORS properly configured

---

## 🎯 Testing the Application

### 1. Start Backend
```bash
cd stack
mvn spring-boot:run
```

### 2. Start Frontend
```bash
cd stack-family-finance
npm run dev
```

### 3. Test Parent Flow
1. Go to `http://localhost:5173`
2. Click "Register"
3. Create account as "PARENT"
4. Login
5. Create a family (e.g., "Smith Family")
6. Click "Generate Invite Code"
7. Copy the code (e.g., "ABC12345")

### 4. Test Child Flow
1. Open incognito window or different browser
2. Go to `http://localhost:5173`
3. Register as "CHILD"
4. Login
5. Go to Family page
6. Enter the invite code
7. Join family

### 5. Verify No Errors
- ✅ No 401 Unauthorized errors
- ✅ No 403 Forbidden errors
- ✅ Parent can see family members
- ✅ Child can see family info
- ✅ Games work for children
- ✅ All API calls succeed

---

## 📱 Mobile-Specific Features

### Touch-Optimized UI
- All buttons are minimum 44px height (iOS standard)
- Proper spacing for touch targets
- Responsive design for all screen sizes

### Notifications
The app includes unified notification system:
- Desktop: Native Electron notifications
- Mobile: Capacitor Local Notifications
- Web: Browser notifications

Usage in code:
```typescript
import { showNotification } from '@/lib/notifications';

// Show notification
await showNotification('Task Complete!', 'You earned 50 coins');
```

### Mobile Permissions
Add to `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
<uses-permission android:name="android.permission.VIBRATE" />
```

---

## 🚀 Production Deployment

### Backend
1. Update `application.yml` with production database
2. Change JWT secret to secure random string
3. Build: `mvn clean package`
4. Deploy JAR to server (AWS, Heroku, etc.)

### Frontend Web
1. Update `.env` with production API URL
2. Build: `npm run build`
3. Deploy `dist` folder to Netlify/Vercel/etc.

### Desktop
1. Build: `npm run electron:dist:win`
2. Distribute the installer from `release/` folder

### Mobile
1. Update API URL in code
2. Build signed APK in Android Studio
3. Upload to Google Play Store

---

## 🎨 Design Improvements for Mobile

The current design is already mobile-optimized with:
- ✅ Responsive layouts
- ✅ Touch-friendly buttons (44px minimum)
- ✅ Clean card-based UI
- ✅ Proper spacing and padding
- ✅ Dark mode support

For payment app style improvements, consider:
- Add bottom navigation for mobile
- Use swipe gestures for actions
- Add haptic feedback
- Implement pull-to-refresh
- Add skeleton loaders (already included)

---

## 📞 Support

If you encounter issues:
1. Check backend logs: `stack/logs/`
2. Check browser console for frontend errors
3. Verify database connection
4. Ensure JWT secret is properly set
5. Check CORS configuration

All authentication issues have been fixed! 🎉
