# API Updated to Production Server ✅

## Changes Made

### API Base URL Updated
- **Old URL**: `http://localhost:8080`
- **New URL**: `https://stack.polito.uz/api`

### Files Modified
1. **stack-family-finance/.env**
   - Updated `VITE_API_BASE_URL=https://stack.polito.uz/api`

2. **stack-family-finance/src/lib/api.ts**
   - Updated fallback URL to production server
   - All API requests now point to `https://stack.polito.uz/api`

## Rebuilt Applications

### 1. Web Application ✅
- Built with Vite
- Location: `stack-family-finance/dist/`
- All assets compiled with production API URL

### 2. Android APK ✅
- **File**: `STACK-Kids-Bank.apk`
- **Size**: 6.1 MB
- **Location**: Root folder
- **Build Date**: March 9, 2026 17:39
- Synced with latest web build
- Uses production API: `https://stack.polito.uz/api`

### 3. Windows Desktop App ✅
- **File**: `STACK-Kids-Bank-Setup-FIXED.exe`
- **Size**: 112 MB
- **Location**: Root folder
- **Build Date**: March 9, 2026 17:42
- Electron installer with production API
- Uses production API: `https://stack.polito.uz/api`

## How to Use

### Web Application
1. Deploy the `stack-family-finance/dist/` folder to your web server
2. All requests will go to `https://stack.polito.uz/api`

### Android APK
1. Install `STACK-Kids-Bank.apk` on Android device
2. App will connect to production server automatically
3. No localhost dependencies

### Windows Desktop App
1. Run `STACK-Kids-Bank-Setup-FIXED.exe`
2. Follow installation wizard
3. App will connect to production server automatically

## Platform Detection
- **Web Browser**: Shows landing page first, then login
- **Desktop App (.exe)**: Goes directly to login page
- **Mobile App (.apk)**: Goes directly to login page

## API Endpoints
All applications now connect to:
```
https://stack.polito.uz/api/auth/login
https://stack.polito.uz/api/auth/register
https://stack.polito.uz/api/family/*
https://stack.polito.uz/api/accounts/*
https://stack.polito.uz/api/transactions/*
https://stack.polito.uz/api/dashboard/*
https://stack.polito.uz/api/goals/*
https://stack.polito.uz/api/games/*
```

## Testing
1. Install the APK or EXE file
2. Register a new account
3. All data will be stored on production server
4. No need to run local backend

## Notes
- Make sure your production backend is running at `https://stack.polito.uz/api`
- Backend should have CORS configured to allow requests from all origins
- SSL certificate should be valid for HTTPS
- All 8 games are included and working
- Family management features are complete
- Landing page is integrated for web version

## Files Ready for Distribution
✅ `STACK-Kids-Bank.apk` - Android application
✅ `STACK-Kids-Bank-Setup-FIXED.exe` - Windows installer
✅ `stack-family-finance/dist/` - Web application files

All applications are now configured for production use!
