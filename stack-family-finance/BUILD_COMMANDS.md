# 🛠️ Build Commands Reference

## 📋 Prerequisites

### For All Builds:
- Node.js 18+
- npm or yarn

### For Desktop:
- Windows: No additional requirements
- macOS: Xcode Command Line Tools
- Linux: Standard build tools

### For Mobile:
- Android Studio
- Java 17
- Android SDK

---

## 🌐 Web Development

### Install Dependencies
```bash
cd stack-family-finance
npm install
```

### Run Development Server
```bash
npm run dev
```
Opens at http://localhost:5173

### Build for Production
```bash
npm run build
```
Output in `dist/` folder

### Preview Production Build
```bash
npm run preview
```

---

## 🖥️ Desktop (Electron)

### Install Electron Dependencies
```bash
npm install -D electron electron-builder electron-vite
```

### Run in Development Mode
```bash
npm run electron:dev
```

### Build (No Installer)
```bash
npm run electron:pack
```
Output in `release/` folder (unpacked)

### Build Windows Installer (.exe)
```bash
npm run electron:dist:win
```
Output: `release/STACK Kids Bank-Setup-1.0.0.exe`

### Build for All Platforms
```bash
npm run electron:dist
```
Builds for current platform

---

## 📱 Mobile (Capacitor)

### Install Capacitor Dependencies
```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android @capacitor/local-notifications @capacitor/push-notifications
```

### Initialize Capacitor
```bash
npm run mobile:init
```
Follow prompts:
- App name: STACK Kids Bank
- App ID: com.kidsbank.stack
- Web directory: dist

### Add Android Platform
```bash
npm run mobile:add:android
```

### Build Web Assets and Sync
```bash
npm run mobile:build
```

### Sync Changes Only
```bash
npm run mobile:sync
```

### Open in Android Studio
```bash
npm run mobile:open:android
```

### Build APK in Android Studio
1. Wait for Gradle sync
2. Build > Build Bundle(s) / APK(s) > Build APK(s)
3. Find in `android/app/build/outputs/apk/debug/`

### Build Release APK
1. Build > Generate Signed Bundle / APK
2. Select APK
3. Create/select keystore
4. Choose release variant
5. Find in `android/app/build/outputs/apk/release/`

---

## 🔧 Backend (Spring Boot)

### Run Development Server
```bash
cd stack
mvn spring-boot:run
```
Runs on http://localhost:8080

### Build JAR
```bash
mvn clean package
```
Output: `target/kidsbank-api-0.0.1-SNAPSHOT.jar`

### Run JAR
```bash
java -jar target/kidsbank-api-0.0.1-SNAPSHOT.jar
```

---

## 🧪 Testing

### Run Frontend Tests
```bash
npm run test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Lint Code
```bash
npm run lint
```

---

## 📦 Complete Build Process

### For Web Deployment:
```bash
# 1. Build frontend
cd stack-family-finance
npm install
npm run build

# 2. Deploy dist/ folder to hosting
# (Netlify, Vercel, AWS S3, etc.)
```

### For Desktop Distribution:
```bash
# 1. Install dependencies
npm install -D electron electron-builder electron-vite

# 2. Build installer
npm run electron:dist:win

# 3. Distribute release/STACK Kids Bank-Setup-1.0.0.exe
```

### For Mobile Distribution:
```bash
# 1. Install Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. Initialize and add platform
npm run mobile:init
npm run mobile:add:android

# 3. Build and open
npm run mobile:build
npm run mobile:open:android

# 4. In Android Studio:
#    - Build > Generate Signed Bundle / APK
#    - Upload to Google Play Store
```

---

## 🔄 Update Process

### After Code Changes (Web):
```bash
# Just rebuild
npm run build
```

### After Code Changes (Desktop):
```bash
# Rebuild electron
npm run electron:dist:win
```

### After Code Changes (Mobile):
```bash
# Sync changes
npm run mobile:sync

# Or full rebuild
npm run mobile:build
```

---

## 🐛 Troubleshooting

### "electron not found"
```bash
npm install -D electron electron-builder electron-vite
```

### "capacitor not found"
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
```

### "Gradle sync failed"
- Open Android Studio
- File > Invalidate Caches / Restart
- Let Gradle sync complete

### "Port 5173 already in use"
```bash
# Kill the process or use different port
npm run dev -- --port 5174
```

### "Port 8080 already in use"
```bash
# Find and kill process on Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

---

## 📝 Environment Variables

### Development (.env)
```
VITE_API_BASE_URL=http://localhost:8080
```

### Production (.env.production)
```
VITE_API_BASE_URL=https://api.yourdomain.com
```

### Use in Build
```bash
# Development build
npm run build:dev

# Production build
npm run build
```

---

## ✅ Quick Reference

| Task | Command |
|------|---------|
| Web dev | `npm run dev` |
| Web build | `npm run build` |
| Desktop dev | `npm run electron:dev` |
| Desktop build | `npm run electron:dist:win` |
| Mobile init | `npm run mobile:init` |
| Mobile build | `npm run mobile:build` |
| Mobile open | `npm run mobile:open:android` |
| Backend run | `mvn spring-boot:run` |
| Tests | `npm run test` |

---

## 🎯 Recommended Workflow

### Daily Development:
```bash
# Terminal 1: Backend
cd stack
mvn spring-boot:run

# Terminal 2: Frontend
cd stack-family-finance
npm run dev
```

### Before Release:
```bash
# 1. Test everything
npm run test

# 2. Build web
npm run build

# 3. Build desktop
npm run electron:dist:win

# 4. Build mobile
npm run mobile:build
npm run mobile:open:android
# Then build APK in Android Studio
```

That's it! You're ready to build for any platform. 🚀
