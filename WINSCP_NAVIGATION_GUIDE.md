# HOW TO NAVIGATE TO /var/www/html IN WINSCP

## METHOD 1: Type the Path Directly (EASIEST)

1. Open WinSCP and connect to your server
2. Look at the top of WinSCP - there's a path bar (address bar)
3. Click on the path bar
4. Type: `/var/www/html`
5. Press ENTER
6. You're now in the correct folder!

---

## METHOD 2: Use "Go To" Command

1. In WinSCP, press `Ctrl + G` (or click Commands → Go To)
2. Type: `/var/www/html`
3. Click OK
4. You're now in the correct folder!

---

## METHOD 3: Navigate from Root

1. In WinSCP, click on the path bar at the top
2. Type just: `/`
3. Press ENTER (now you're at root)
4. Double-click on `var` folder
5. Double-click on `www` folder
6. Double-click on `html` folder
7. You're now in the correct folder!

---

## METHOD 4: Show Hidden Files (if /var is hidden)

1. In WinSCP, go to Options → Preferences
2. Click on "Panels" in the left menu
3. Check the box "Show hidden files"
4. Click OK
5. Now try Method 3 again

---

## WHAT TO DO ONCE YOU'RE IN /var/www/html

Now you can drag and drop these files:

1. **STACK-Kids-Bank.apk** (102 MB)
2. **STACK-Kids-Bank-Windows.zip** (228 MB)
3. **WINDOWS-INSTALL-INSTRUCTIONS.txt**

Just drag them from your computer (left side) to the server folder (right side).

---

## ALTERNATIVE: Use Command Line in WinSCP

1. In WinSCP, press `Ctrl + T` to open terminal
2. Type: `cd /var/www/html`
3. Type: `ls -la` to see what's in the folder
4. Now you can use the file browser to upload files

---

## IF YOU STILL CAN'T SEE /var FOLDER

The folder might be restricted. Try this:

1. Open WinSCP terminal (`Ctrl + T`)
2. Type: `sudo ls -la /var/www/html`
3. This will show you what's in the folder
4. If you see files, the folder exists
5. You might need to change permissions:
   ```
   sudo chmod 755 /var/www/html
   ```

Then try navigating again using Method 1 (type path directly).
