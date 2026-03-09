# Fix Git Large Files Issue

## Problem
GitHub rejected your push because `stack-family-finance/STACK-Kids-Bank.apk` is 118 MB, which exceeds GitHub's 100 MB limit.

## Solution

Run these commands to remove large files from git history:

```bash
# 1. Remove the large APK file from git tracking
git rm --cached stack-family-finance/STACK-Kids-Bank.apk
git rm --cached STACK-Kids-Bank.apk
git rm --cached STACK-Kids-Bank-Setup.exe
git rm --cached STACK-Kids-Bank-Setup-FIXED.exe

# 2. Remove from public folder if tracked
git rm --cached stack-family-finance/public/STACK-Kids-Bank.apk
git rm --cached stack-family-finance/public/STACK-Kids-Bank-Setup.exe

# 3. Commit the removal
git add .gitignore
git commit -m "Remove large binary files from git tracking"

# 4. Push to GitHub
git push origin main
```

## Alternative: If files are in git history

If the files were previously committed, you need to remove them from history:

```bash
# Remove from all history (WARNING: This rewrites history!)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch stack-family-finance/STACK-Kids-Bank.apk" \
  --prune-empty --tag-name-filter cat -- --all

git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch STACK-Kids-Bank.apk" \
  --prune-empty --tag-name-filter cat -- --all

git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch STACK-Kids-Bank-Setup.exe" \
  --prune-empty --tag-name-filter cat -- --all

git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch STACK-Kids-Bank-Setup-FIXED.exe" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (WARNING: This will overwrite remote history!)
git push origin main --force
```

## Better Solution: Use Git LFS (Large File Storage)

If you want to keep these files in git:

```bash
# 1. Install Git LFS
# Download from: https://git-lfs.github.com/

# 2. Initialize Git LFS
git lfs install

# 3. Track large files
git lfs track "*.apk"
git lfs track "*.exe"

# 4. Add .gitattributes
git add .gitattributes

# 5. Commit and push
git commit -m "Add Git LFS tracking for large files"
git push origin main
```

## Recommended Approach

**Don't commit binary files to git!** Instead:

1. Keep APK and EXE files out of git (already added to .gitignore)
2. Upload them to your server directly
3. Or use a file hosting service (Google Drive, Dropbox, etc.)
4. Update download links to point to hosted files

## Quick Fix (Recommended)

```bash
# 1. Remove files from git
git rm --cached stack-family-finance/STACK-Kids-Bank.apk 2>$null
git rm --cached STACK-Kids-Bank.apk 2>$null
git rm --cached STACK-Kids-Bank-Setup.exe 2>$null
git rm --cached STACK-Kids-Bank-Setup-FIXED.exe 2>$null
git rm --cached stack-family-finance/public/*.apk 2>$null
git rm --cached stack-family-finance/public/*.exe 2>$null

# 2. Commit
git add .gitignore
git commit -m "Remove binary files from git, update .gitignore"

# 3. Push
git push origin main
```

## Where to Host Binary Files

### Option 1: Direct Server Upload
Upload APK and EXE directly to your server:
```bash
scp STACK-Kids-Bank.apk user@stack.polito.uz:/var/www/stack/
scp STACK-Kids-Bank-Setup.exe user@stack.polito.uz:/var/www/stack/
```

### Option 2: GitHub Releases
1. Go to your GitHub repository
2. Click "Releases" → "Create a new release"
3. Upload APK and EXE as release assets
4. Update download links to point to release URLs

### Option 3: Cloud Storage
- Google Drive
- Dropbox
- AWS S3
- Azure Blob Storage

## Updated .gitignore

The .gitignore has been updated to exclude:
- *.apk
- *.exe
- STACK-Kids-Bank.apk
- STACK-Kids-Bank-Setup.exe
- stack-family-finance/public/*.apk
- stack-family-finance/public/*.exe
- stack-family-finance/android/app/build/

## Summary

1. ✅ Updated .gitignore to exclude binary files
2. ⚠️ Need to remove files from git tracking
3. ⚠️ Need to upload binaries to server separately
4. ✅ Source code can be pushed to GitHub

Run the "Quick Fix" commands above to resolve the issue!
