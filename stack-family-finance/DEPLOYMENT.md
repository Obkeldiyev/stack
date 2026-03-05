# STACK Kids Bank - Deployment Guide

## Backend (Spring Boot)

### Prerequisites
- Java 17+
- PostgreSQL database
- Maven

### Setup
1. Update `application.yml` with your database credentials
2. Run the backend:
```bash
cd stack
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`

---

## Frontend - Web Version

### Development
```bash
cd stack-family-finance
npm install
npm run dev
```

### Production Build
```bash
npm run build
```

Deploy the `dist` folder to any static hosting (Netlify, Vercel, etc.)

---

## Desktop Version (.exe for Windows)

### Prerequisites
```bash
npm install -D electron electron-builder electron-vite
```

### Update package.json
Add these scripts:
```json
{
  "scripts": {
    "electron:dev": "electron-vite dev",
    "electron:build": "electron-vite build",
    "electron:preview": "electron-vite preview",
    "electron:pack": "npm run electron:build && electron-builder --dir",
    "electron:dist": "npm run electron:build && electron-builder"
  },
  "main": "dist-electron/main/index.js"
}
```

### Build Configuration
Create `electron-builder.yml`:
```yaml
appId: com.kidsbank.stack
productName: STACK Kids Bank
directories:
  output: release
  buildResources: build
files:
  - dist
  - dist-electron
win:
  target:
    - nsis
  icon: public/favicon.ico
nsis:
  oneClick: false
  allowToChangeInstallationDirectory: true
  createDesktopShortcut: true
  createStartMenuShortcut: true
```

### Build for Windows
```bash
npm run electron:dist -- --win
```

The `.exe` installer will be in the `release` folder.

---

## Mobile Version (Android)

### Prerequisites
```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/local-notifications @capacitor/push-notifications
npx cap init
```

### Build Web Assets
```bash
npm run build
```

### Add Android Platform
```bash
npx cap add android
```

### Sync Changes
```bash
npx cap sync android
```

### Open in Android Studio
```bash
npx cap open android
```

### Build APK
In Android Studio:
1. Build > Build Bundle(s) / APK(s) > Build APK(s)
2. The APK will be in `android/app/build/outputs/apk/`

### Mobile-Optimized Styles
The app already uses:
- `min-h-[44px]` for touch-friendly buttons (44px is iOS minimum)
- Responsive design with Tailwind
- Touch-optimized spacing

### Notifications Setup
Add to `AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
<uses-permission android:name="android.permission.VIBRATE" />
```

---

## Environment Variables

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:8080
```

For production, update to your deployed backend URL.

### Backend (application.yml)
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/kidsbank
    username: your_username
    password: your_password

app:
  jwt:
    secret: "YOUR_SECURE_SECRET_KEY_AT_LEAST_64_CHARS"
    accessTokenMinutes: 60
```

---

## Key Features Implemented

✅ Parent/Child separate registration
✅ JWT authentication with proper role-based access
✅ Family creation and invite system
✅ Fixed 401/403 authentication errors
✅ Desktop-ready (Electron)
✅ Mobile-ready (Capacitor)
✅ Unified notification system
✅ Touch-optimized UI (44px minimum touch targets)
✅ Responsive design for all screen sizes

---

## Testing the Fix

1. Start backend: `cd stack && mvn spring-boot:run`
2. Start frontend: `cd stack-family-finance && npm run dev`
3. Register as PARENT
4. Create a family
5. Generate invite code
6. Register as CHILD (in incognito/different browser)
7. Join family with code
8. Both should now work without 401/403 errors!

---

## Architecture Notes

### Authentication Flow
1. User registers/logs in → Backend returns `{token, user: {id, username, role}}`
2. Frontend stores token in localStorage
3. All API requests include `Authorization: Bearer <token>` header
4. Backend JWT filter extracts userId from token and sets it as principal
5. Controllers access userId via `auth.getPrincipal()`

### Parent-Child Relationship
- Parents can ONLY create families and invite children
- Children can ONLY join families via invite codes
- Parents cannot register as children and vice versa
- Each family has separate parent/child members with different permissions
