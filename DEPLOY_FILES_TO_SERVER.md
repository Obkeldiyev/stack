# Deploy Files to Server

## Problem
The website download buttons are trying to download files that don't exist on the server yet.

## Solution
You need to upload the APK and EXE files to your server.

## Files to Upload

### 1. Web Application
```
stack-family-finance/dist/
├── index.html
├── assets/
│   ├── index-[hash].css
│   └── index-[hash].js
├── logo.png
├── placeholder.svg
└── robots.txt
```

### 2. Download Files
```
STACK-Kids-Bank.apk (1.74 MB)
STACK-Kids-Bank-Setup.exe (85.58 MB)
```

## Upload Commands

### Option 1: Using SCP (Secure Copy)

```bash
# Upload web app
scp -r stack-family-finance/dist/* user@stack.polito.uz:/var/www/stack/

# Upload APK
scp STACK-Kids-Bank.apk user@stack.polito.uz:/var/www/stack/

# Upload EXE
scp STACK-Kids-Bank-Setup.exe user@stack.polito.uz:/var/www/stack/
```

### Option 2: Using SFTP

```bash
# Connect to server
sftp user@stack.polito.uz

# Navigate to web directory
cd /var/www/stack

# Upload web app
put -r stack-family-finance/dist/* .

# Upload APK
put STACK-Kids-Bank.apk

# Upload EXE
put STACK-Kids-Bank-Setup.exe

# Exit
exit
```

### Option 3: Using FileZilla (GUI)

1. Download FileZilla: https://filezilla-project.org/
2. Connect to your server:
   - Host: stack.polito.uz
   - Username: your_username
   - Password: your_password
   - Port: 22
3. Navigate to `/var/www/stack/`
4. Upload files:
   - All files from `stack-family-finance/dist/`
   - `STACK-Kids-Bank.apk`
   - `STACK-Kids-Bank-Setup.exe`

### Option 4: Using rsync (Recommended)

```bash
# Sync web app (faster, only uploads changed files)
rsync -avz --delete stack-family-finance/dist/ user@stack.polito.uz:/var/www/stack/

# Upload APK
rsync -avz STACK-Kids-Bank.apk user@stack.polito.uz:/var/www/stack/

# Upload EXE
rsync -avz STACK-Kids-Bank-Setup.exe user@stack.polito.uz:/var/www/stack/
```

## Verify Files on Server

After uploading, SSH to your server and verify:

```bash
# SSH to server
ssh user@stack.polito.uz

# Check files exist
ls -lh /var/www/stack/

# Should see:
# - index.html
# - assets/
# - STACK-Kids-Bank.apk (1.74 MB)
# - STACK-Kids-Bank-Setup.exe (85.58 MB)
# - logo.png
# - placeholder.svg
# - robots.txt

# Check file sizes
du -h /var/www/stack/STACK-Kids-Bank.apk
du -h /var/www/stack/STACK-Kids-Bank-Setup.exe

# Set correct permissions
sudo chown -R www-data:www-data /var/www/stack/
sudo chmod -R 755 /var/www/stack/
```

## Test Downloads

After uploading, test the downloads:

```bash
# Test APK download
curl -I https://stack.polito.uz/STACK-Kids-Bank.apk

# Should return:
# HTTP/1.1 200 OK
# Content-Length: 1824768 (1.74 MB)
# Content-Type: application/vnd.android.package-archive

# Test EXE download
curl -I https://stack.polito.uz/STACK-Kids-Bank-Setup.exe

# Should return:
# HTTP/1.1 200 OK
# Content-Length: 89726976 (85.58 MB)
# Content-Type: application/x-msdownload
```

## Quick Deploy Script

Create a file `deploy.sh`:

```bash
#!/bin/bash

SERVER="user@stack.polito.uz"
WEB_DIR="/var/www/stack"

echo "Building web app..."
cd stack-family-finance
npm run build

echo "Uploading web app..."
rsync -avz --delete dist/ $SERVER:$WEB_DIR/

echo "Uploading APK..."
rsync -avz ../STACK-Kids-Bank.apk $SERVER:$WEB_DIR/

echo "Uploading EXE..."
rsync -avz ../STACK-Kids-Bank-Setup.exe $SERVER:$WEB_DIR/

echo "Setting permissions..."
ssh $SERVER "sudo chown -R www-data:www-data $WEB_DIR && sudo chmod -R 755 $WEB_DIR"

echo "Deployment complete!"
echo "Test at: https://stack.polito.uz/"
```

Make it executable:
```bash
chmod +x deploy.sh
./deploy.sh
```

## Windows PowerShell Deploy Script

Create a file `deploy.ps1`:

```powershell
$SERVER = "user@stack.polito.uz"
$WEB_DIR = "/var/www/stack"

Write-Host "Building web app..." -ForegroundColor Green
cd stack-family-finance
npm run build

Write-Host "Uploading web app..." -ForegroundColor Green
scp -r dist/* ${SERVER}:${WEB_DIR}/

Write-Host "Uploading APK..." -ForegroundColor Green
cd ..
scp STACK-Kids-Bank.apk ${SERVER}:${WEB_DIR}/

Write-Host "Uploading EXE..." -ForegroundColor Green
scp STACK-Kids-Bank-Setup.exe ${SERVER}:${WEB_DIR}/

Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "Test at: https://stack.polito.uz/"
```

Run it:
```powershell
.\deploy.ps1
```

## Troubleshooting

### Downloads return 404
- Files not uploaded to server
- Check file paths on server
- Verify nginx is serving static files

### Downloads are slow
- Files are large (85 MB for EXE)
- Consider using a CDN
- Enable gzip compression in nginx

### Permission denied
```bash
# Fix permissions
sudo chown -R www-data:www-data /var/www/stack/
sudo chmod -R 755 /var/www/stack/
```

### Wrong file downloaded
- Clear browser cache
- Check file names match exactly
- Verify files on server

## File Structure on Server

After deployment, your server should have:

```
/var/www/stack/
├── index.html                      (1.22 KB)
├── assets/
│   ├── index-D8GAIHsx.css         (82.32 KB)
│   └── index-ZEqcvaqK.js          (521.47 KB)
├── STACK-Kids-Bank.apk            (1.74 MB)
├── STACK-Kids-Bank-Setup.exe      (85.58 MB)
├── logo.png
├── placeholder.svg
└── robots.txt
```

## Summary

1. Build web app: `npm run build`
2. Upload dist/ folder to server
3. Upload STACK-Kids-Bank.apk to server
4. Upload STACK-Kids-Bank-Setup.exe to server
5. Set correct permissions
6. Test downloads at https://stack.polito.uz/

Choose the upload method that works best for you (SCP, SFTP, FileZilla, or rsync).
