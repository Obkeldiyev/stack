# 📱 Build Android APK - Complete Guide

## ✅ Android Project Ready!

The Android project has been created and is ready to build!

**Location:** `stack-family-finance/android/`

---

## 🎯 Two Ways to Build APK

### Option 1: Using Android Studio (Recommended) ⭐

#### Step 1: Install Android Studio
1. Download from: https://developer.android.com/studio
2. Install Android Studio
3. During installation, make sure to install:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device (optional)

#### Step 2: Open Project
1. Open Android Studio
2. Click "Open an Existing Project"
3. Navigate to: `stack-family-finance/android`
4. Click "OK"
5. Wait for Gradle sync to complete

#### Step 3: Build APK
1. In Android Studio menu: **Build → Build Bundle(s) / APK(s) → Build APK(s)**
2. Wait for build to complete (2-5 minutes)
3. Click "locate" in the notification
4. APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

#### Step 4: Install on Phone
1. Copy `app-debug.apk` to your phone
2. Open the APK file on your phone
3. Allow "Install from Unknown Sources" if prompted
4. Install the app
5. Open "STACK Kids Bank" app

---

### Option 2: Using Command Line (Advanced)

#### Prerequisites:
1. **Install Android Studio** (for SDK)
2. **Set ANDROID_HOME environment variable**

#### Windows Setup:
```powershell
# Add to System Environment Variables:
ANDROID_HOME = C:\Users\YourUsername\AppData\Local\Android\Sdk

# Add to PATH:
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
```

#### Build Commands:
```bash
# Navigate to project
cd stack-family-finance

# Build web app
npm run build

# Sync with Android
npx cap sync android

# Build APK
cd android
gradlew.bat assembleDebug

# APK location:
# android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📦 APK Output Location

After successful build, find your APK at:

```
stack-family-finance/
  └── android/
      └── app/
          └── build/
              └── outputs/
                  └── apk/
                      └── debug/
                          └── app-debug.apk  ← YOUR APK!
```

**File Size:** ~15-25 MB

---

## 🚀 Quick Build (If Android Studio Installed)

### 1. Open Android Studio
```
File → Open → Select: stack-family-finance/android
```

### 2. Build APK
```
Build → Build Bundle(s) / APK(s) → Build APK(s)
```

### 3. Get APK
```
Click "locate" in notification
Or navigate to: android/app/build/outputs/apk/debug/
```

---

## 📱 Install APK on Phone

### Method 1: USB Cable
1. Enable Developer Options on phone:
   - Settings → About Phone
   - Tap "Build Number" 7 times
2. Enable USB Debugging:
   - Settings → Developer Options → USB Debugging
3. Connect phone to computer
4. In Android Studio: **Run → Run 'app'**
5. Select your device
6. App installs automatically

### Method 2: File Transfer
1. Copy `app-debug.apk` to phone (via USB, email, cloud)
2. On phone, open the APK file
3. Tap "Install"
4. Allow "Install from Unknown Sources" if prompted
5. Open the app

### Method 3: ADB Install
```bash
# Connect phone via USB
adb devices

# Install APK
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🎨 App Details

### App Information:
- **App Name:** STACK Kids Bank
- **Package:** com.kidsbank.stack
- **Version:** 1.0.0
- **Min SDK:** Android 5.0 (API 21)
- **Target SDK:** Android 14 (API 34)

### Features Included:
- ✅ Full banking dashboard
- ✅ All 5 games
- ✅ Money transfers
- ✅ Savings goals
- ✅ Transaction history
- ✅ Family management
- ✅ Push notifications support
- ✅ Local notifications support
- ✅ Offline game play

### Permissions:
- Internet (for API calls)
- Notifications (for alerts)
- Vibrate (for game feedback)

---

## 🔧 Troubleshooting

### "SDK location not found"
**Solution:** Install Android Studio and set ANDROID_HOME

### "Gradle sync failed"
**Solution:** 
1. Open Android Studio
2. File → Invalidate Caches → Invalidate and Restart
3. Try building again

### "Build failed"
**Solution:**
1. Check Android Studio is installed
2. Check SDK is downloaded
3. Try: Build → Clean Project
4. Then: Build → Build APK(s)

### "App not installing on phone"
**Solution:**
1. Enable "Unknown Sources" in phone settings
2. Check phone has enough storage
3. Try uninstalling old version first

---

## 📊 Build Variants

### Debug APK (Development)
- **File:** `app-debug.apk`
- **Size:** ~20 MB
- **Signed:** Debug keystore
- **Use:** Testing, development

### Release APK (Production)
- **File:** `app-release.apk`
- **Size:** ~15 MB (optimized)
- **Signed:** Your keystore
- **Use:** Google Play Store

To build release:
```bash
cd android
gradlew.bat assembleRelease
```

---

## 🎯 Current Status

### ✅ Completed:
- Web app built (`dist/` folder)
- Android project created (`android/` folder)
- Capacitor configured
- Assets synced
- Plugins installed
- Ready to build

### ⏳ Next Step:
**Install Android Studio and build APK**

---

## 📝 Step-by-Step Summary

1. ✅ **Web Build** - Done! (`npm run build`)
2. ✅ **Android Project** - Done! (`npx cap add android`)
3. ✅ **Sync Assets** - Done! (`npx cap sync android`)
4. ⏳ **Install Android Studio** - You need to do this
5. ⏳ **Build APK** - Open project in Android Studio
6. ⏳ **Install on Phone** - Copy APK to phone

---

## 🚀 Alternative: Online Build Services

If you don't want to install Android Studio:

### 1. Expo EAS Build
- Upload project to Expo
- Build in cloud
- Download APK

### 2. Capacitor Cloud
- Use Capacitor's cloud build
- No local setup needed

### 3. GitHub Actions
- Set up CI/CD
- Auto-build on push
- Download artifacts

---

## 💡 Quick Tips

### For Faster Builds:
1. Use Android Studio (has caching)
2. Keep Gradle daemon running
3. Use SSD for Android SDK
4. Allocate more RAM to Gradle

### For Smaller APK:
1. Build release variant
2. Enable ProGuard
3. Use APK splits
4. Remove unused resources

### For Testing:
1. Use Android Emulator (in Android Studio)
2. Or use real device via USB
3. Enable USB Debugging
4. Use `adb logcat` for logs

---

## 🎊 Summary

**Your Android project is ready!**

✅ Project created
✅ Assets synced
✅ Plugins configured
✅ Ready to build

**Next:** Install Android Studio and build the APK!

**Download Android Studio:**
https://developer.android.com/studio

**After building, your APK will be at:**
`android/app/build/outputs/apk/debug/app-debug.apk`

---

## 📞 Need Help?

### Common Issues:
1. **No Android Studio?** → Download and install it
2. **Build fails?** → Check SDK is installed
3. **Can't install APK?** → Enable Unknown Sources
4. **App crashes?** → Check backend URL in code

### Resources:
- Android Studio: https://developer.android.com/studio
- Capacitor Docs: https://capacitorjs.com/docs/android
- Gradle Docs: https://gradle.org/

**Good luck building your APK!** 🚀📱
