# SERVER DEPLOYMENT GUIDE - SIMPLE STEPS

## WHAT YOU NEED TO COPY TO YOUR SERVER

### 📱 STEP 1: ANDROID APK FILE
**FROM YOUR COMPUTER:**
```
C:\Users\obkel\OneDrive\Desktop\stack full\STACK-Kids-Bank.apk
(102 MB)
```

**TO YOUR SERVER:**
```
/var/www/html/STACK-Kids-Bank.apk
```

**HOW:** 
- Open WinSCP
- Connect to stack.polito.uz
- Navigate to `/var/www/html/`
- Drag and drop `STACK-Kids-Bank.apk` file there

---

### 💻 STEP 2: WINDOWS ZIP FILE
**FROM YOUR COMPUTER:**
```
C:\Users\obkel\OneDrive\Desktop\stack full\STACK-Kids-Bank-Windows.zip
(228 MB)
```

**TO YOUR SERVER:**
```
/var/www/html/STACK-Kids-Bank-Windows.zip
```

**HOW:** 
- In WinSCP (same location as Step 1)
- Still in `/var/www/html/`
- Drag and drop `STACK-Kids-Bank-Windows.zip` file there

---

### 📄 STEP 3: WINDOWS INSTRUCTIONS FILE
**FROM YOUR COMPUTER:**
```
C:\Users\obkel\OneDrive\Desktop\stack full\WINDOWS-INSTALL-INSTRUCTIONS.txt
```

**TO YOUR SERVER:**
```
/var/www/html/WINDOWS-INSTALL-INSTRUCTIONS.txt
```

**HOW:** 
- In WinSCP (same location)
- Still in `/var/www/html/`
- Drag and drop `WINDOWS-INSTALL-INSTRUCTIONS.txt` file there

---

### 🌐 STEP 4: WEB APP FILES (FRONTEND)
**FROM YOUR COMPUTER:**
```
C:\Users\obkel\OneDrive\Desktop\stack full\stack-family-finance\dist\
(entire folder with all files inside)
```

**TO YOUR SERVER:**
```
/var/www/html/
```

**HOW:** 
- First, BUILD the web app on your computer:
  ```
  cd stack-family-finance
  npm run build
  ```
- In WinSCP, navigate to `/var/www/html/`
- Open the `dist` folder on your computer
- Select ALL files inside `dist` folder
- Drag and drop ALL files to `/var/www/html/`
- This will replace old files with new ones

---

### ☕ STEP 5: BACKEND JAR FILE
**FROM YOUR COMPUTER:**
```
C:\Users\obkel\OneDrive\Desktop\stack full\stack\target\kidsbank-api-0.0.1-SNAPSHOT.jar
```

**TO YOUR SERVER:**
```
/home/your-username/kidsbank-api-0.0.1-SNAPSHOT.jar
```

**HOW:** 
- First, BUILD the backend on your computer:
  ```
  cd stack
  mvn clean package -DskipTests
  ```
- In WinSCP, navigate to `/home/your-username/` (your home directory)
- Drag and drop `kidsbank-api-0.0.1-SNAPSHOT.jar` file there
- After upload, restart the backend service:
  ```
  sudo systemctl restart kidsbank
  ```

---

## QUICK CHECKLIST

✅ **Files in `/var/www/html/` (public download files):**
- STACK-Kids-Bank.apk (102 MB)
- STACK-Kids-Bank-Windows.zip (228 MB)
- WINDOWS-INSTALL-INSTRUCTIONS.txt
- index.html (from dist folder)
- assets/ folder (from dist folder)
- All other files from dist folder

✅ **Files in `/home/your-username/` (backend):**
- kidsbank-api-0.0.1-SNAPSHOT.jar

---

## DOWNLOAD LINKS WILL BE:

- Android APK: `https://stack.polito.uz/STACK-Kids-Bank.apk`
- Windows ZIP: `https://stack.polito.uz/STACK-Kids-Bank-Windows.zip`
- Windows Instructions: `https://stack.polito.uz/WINDOWS-INSTALL-INSTRUCTIONS.txt`
- Web App: `https://stack.polito.uz/`

---

## IMPORTANT NOTES:

1. **Build before upload:** Always run build commands before copying files
2. **Replace old files:** When uploading, replace old files with new ones
3. **Restart backend:** After uploading JAR file, restart the service
4. **Test downloads:** After upload, test download links in browser
5. **File permissions:** Make sure files have correct permissions (644 for files, 755 for directories)

---

## IF SOMETHING DOESN'T WORK:

1. Check file permissions on server
2. Check nginx is running: `sudo systemctl status nginx`
3. Check backend is running: `sudo systemctl status kidsbank`
4. Check backend logs: `sudo journalctl -u kidsbank -f`
