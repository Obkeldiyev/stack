# YOU MUST REBUILD EVERYTHING! 🔨

## ⚠️ IMPORTANT: Old files DON'T have the fixes!

The current APK and EXE files were built BEFORE the fixes. They will NOT work properly.

You MUST rebuild to get:
- ✅ Camera permissions
- ✅ Working QR scanner
- ✅ Larger QR codes
- ✅ Fixed money transfers

---

## STEP 1: Build Android APK (10-15 minutes)

```bash
cd stack-family-finance

# Install the new QR scanner library
npm install

# Build the web app
npm run build

# Sync with Android
npx cap sync android

# Build APK
cd android
gradlew assembleDebug
```

**New APK location:**
```
stack-family-finance/android/app/build/outputs/apk/debug/app-debug.apk
```

**Copy this to root:**
```bash
cd ../..
copy android\app\build\outputs\apk\debug\app-debug.apk STACK-Kids-Bank.apk
```

---

## STEP 2: Build Windows EXE (5-10 minutes)

```bash
cd stack-family-finance

# Build Electron app
npm run build:electron

# Create portable ZIP
cd release/win-unpacked
tar -a -c -f ../../STACK-Kids-Bank-Windows.zip *
cd ../..
```

**New ZIP location:**
```
stack-family-finance/STACK-Kids-Bank-Windows.zip
```

**Copy to root:**
```bash
copy STACK-Kids-Bank-Windows.zip ..
```

---

## STEP 3: Update Web App

```bash
cd stack-family-finance

# Build web version
npm run build
```

**Files to upload to server:**
```
stack-family-finance/dist/* → /var/www/html/
```

---

## QUICK COMMANDS (Copy & Paste):

### For Android:
```bash
cd stack-family-finance
npm install
npm run build
npx cap sync android
cd android
gradlew assembleDebug
cd ..
copy android\app\build\outputs\apk\debug\app-debug.apk ..\STACK-Kids-Bank.apk
cd ..
```

### For Windows:
```bash
cd stack-family-finance
npm run build:electron
cd release\win-unpacked
tar -a -c -f ..\..\STACK-Kids-Bank-Windows.zip *
cd ..\..
copy STACK-Kids-Bank-Windows.zip ..
cd ..
```

---

## What Gets Fixed After Rebuild:

### Android APK:
- ✅ Camera permission added to manifest
- ✅ QR scanner actually scans codes
- ✅ QR codes are 300px (bigger, easier to scan)
- ✅ Money transfers validated properly

### Windows EXE:
- ✅ QR scanner works (uses webcam)
- ✅ Larger QR codes
- ✅ Money transfers validated properly

### Web App:
- ✅ All the same fixes
- ✅ Works in browser

---

## DO NOT SKIP REBUILDING!

If you don't rebuild:
- ❌ Camera won't work on Android
- ❌ QR scanner won't scan anything
- ❌ QR codes will be too small
- ❌ Money transfers might fail

**You MUST rebuild to get the fixes!**

---

## After Building:

1. Test the new APK on your Android phone
2. Test the new Windows ZIP on your computer
3. Upload new files to server
4. Update download links

---

## Estimated Time:

- Android build: 10-15 minutes
- Windows build: 5-10 minutes
- Web build: 2-3 minutes
- **Total: ~20-30 minutes**

**START REBUILDING NOW!**
