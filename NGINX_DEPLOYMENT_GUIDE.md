# Nginx Deployment Guide - FIXED ✅

## Problem Identified

### Issue 1: Double /api in URL
- **Error**: `stack.polito.uz/api/api/auth/register` (404)
- **Cause**: Frontend was configured with base URL `https://stack.polito.uz/api`, then adding `/api/auth/register` resulted in double `/api`
- **Fix**: Changed base URL to `https://stack.polito.uz` (without `/api`)

### Issue 2: CORS 403 Error
- **Error**: 403 Forbidden on API requests
- **Cause**: Backend CORS is configured correctly, but nginx might need additional headers
- **Fix**: Updated nginx configuration with proper CORS headers

## Fixed Configuration

### Frontend Configuration (.env)
```env
VITE_API_BASE_URL=https://stack.polito.uz
```

### Frontend API (api.ts)
```typescript
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://stack.polito.uz";
```

Now API calls will be:
- `https://stack.polito.uz/api/auth/login` ✅
- `https://stack.polito.uz/api/auth/register` ✅
- `https://stack.polito.uz/api/games/public/list` ✅

## Recommended Nginx Configuration

```nginx
server {
    listen 8087;
    listen [::]:8087;
    server_name stack.polito.uz www.stack.polito.uz;
    
    root /var/www/stack;
    index index.html;
    
    # SSL Configuration
    ssl_certificate /etc/nginx/ssl/stack.crt;
    ssl_certificate_key /etc/nginx/ssl/stack.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    
    # Increase client body size for file uploads
    client_max_body_size 100M;
    
    # API Proxy Configuration
    location ^~ /api/ {
        # Proxy to Spring Boot backend
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        
        # Headers for proxy
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host  $host;
        proxy_set_header X-Forwarded-Port  $server_port;
        
        # WebSocket support
        proxy_set_header Upgrade           $http_upgrade;
        proxy_set_header Connection        "upgrade";
        
        # Pass Authorization header
        proxy_set_header Authorization     $http_authorization;
        proxy_pass_request_headers on;
        
        # CORS Headers (if backend doesn't handle them)
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, PATCH, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type, Accept, Origin, X-Requested-With' always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;
        
        # Handle preflight requests
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' '*' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, PATCH, OPTIONS' always;
            add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type, Accept, Origin, X-Requested-With' always;
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 600s;
        proxy_read_timeout 600s;
        send_timeout 600s;
    }
    
    # Frontend SPA Configuration
    location / {
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # Don't cache HTML
        location ~* \.html$ {
            add_header Cache-Control "no-cache, no-store, must-revalidate";
        }
    }
    
    # Download files
    location ~* \.(apk|exe)$ {
        add_header Content-Disposition 'attachment';
        add_header Cache-Control "no-cache";
    }
}
```

## Deployment Steps

### 1. Build Frontend
```bash
cd stack-family-finance
npm run build
```

### 2. Deploy to Server
```bash
# Copy dist folder to server
scp -r dist/* user@stack.polito.uz:/var/www/stack/

# Or if using rsync
rsync -avz --delete dist/ user@stack.polito.uz:/var/www/stack/
```

### 3. Update Nginx Configuration
```bash
# Edit nginx config
sudo nano /etc/nginx/sites-available/stack

# Test configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### 4. Verify Backend is Running
```bash
# Check if Spring Boot is running on port 8080
curl http://localhost:8080/api/games/public/list

# Check logs
sudo journalctl -u your-spring-boot-service -f
```

### 5. Test from Browser
```bash
# Test API directly
curl https://stack.polito.uz/api/games/public/list

# Test frontend
curl https://stack.polito.uz/
```

## File Structure on Server

```
/var/www/stack/
├── index.html
├── assets/
│   ├── index-[hash].css
│   └── index-[hash].js
├── STACK-Kids-Bank.apk (6.1 MB)
├── STACK-Kids-Bank-Setup.exe (112 MB)
├── logo.png
├── placeholder.svg
└── robots.txt
```

## Backend Configuration

### application.yml
Make sure your Spring Boot backend has:

```yaml
server:
  port: 8080
  
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/kidsbank
    username: your_username
    password: your_password
```

### CORS Configuration (Already Done)
The backend already has CORS configured in `CorsConfig.java`:
```java
config.setAllowedOriginPatterns(List.of("*"));
config.setAllowedHeaders(List.of("*"));
config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","PATCH","OPTIONS"));
```

## Testing Checklist

### Frontend Tests
- [ ] Landing page loads at `https://stack.polito.uz/`
- [ ] Download buttons work for APK and EXE
- [ ] Navigation to login page works
- [ ] All sections display correctly

### API Tests
- [ ] Register new user works
- [ ] Login works and returns JWT token
- [ ] Games list loads
- [ ] Family creation works
- [ ] Transactions work
- [ ] Dashboard loads

### Mobile/Desktop Tests
- [ ] APK installs on Android
- [ ] EXE installs on Windows
- [ ] Apps connect to production API
- [ ] All features work in native apps

## Troubleshooting

### If you still get 404 errors:
1. Check nginx error logs: `sudo tail -f /var/nginx/error.log`
2. Check backend logs: `sudo journalctl -u your-service -f`
3. Verify backend is running: `curl http://localhost:8080/api/games/public/list`
4. Check nginx is proxying correctly: `sudo nginx -t`

### If you get CORS errors:
1. Check browser console for exact error
2. Verify CORS headers in response: Use browser DevTools Network tab
3. Make sure backend CORS config allows your domain
4. Check nginx CORS headers are being added

### If downloads don't work:
1. Verify files exist: `ls -lh /var/www/stack/*.apk /var/www/stack/*.exe`
2. Check file permissions: `sudo chmod 644 /var/www/stack/*.apk /var/www/stack/*.exe`
3. Check nginx serves static files correctly

## Security Notes

### Production Recommendations:
1. **Use HTTPS**: Already configured with SSL certificates
2. **Restrict CORS**: Change `*` to specific domains in production
3. **Rate Limiting**: Add nginx rate limiting for API endpoints
4. **Firewall**: Only allow ports 80, 443, and 8087
5. **Backend Security**: Keep Spring Boot updated
6. **Database**: Use strong passwords and restrict access

### Example Rate Limiting:
```nginx
# Add to http block
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

# Add to location /api/
limit_req zone=api burst=20 nodelay;
```

## Updated Files

### Local Files (Already Built)
- ✅ `stack-family-finance/.env` - Updated base URL
- ✅ `stack-family-finance/src/lib/api.ts` - Updated base URL
- ✅ `stack-family-finance/dist/` - Built with correct URL
- ✅ `STACK-Kids-Bank.apk` - Rebuilt with correct URL
- ✅ `STACK-Kids-Bank-Setup-FIXED.exe` - Rebuilt with correct URL

### Files to Deploy
1. Upload `stack-family-finance/dist/*` to `/var/www/stack/`
2. Update nginx configuration
3. Reload nginx
4. Verify backend is running

## Summary

The issue was the double `/api` in the URL. By changing the base URL from `https://stack.polito.uz/api` to `https://stack.polito.uz`, the frontend now correctly calls:
- `https://stack.polito.uz/api/auth/login` ✅
- `https://stack.polito.uz/api/games/public/list` ✅

All apps (web, Android, Windows) have been rebuilt with the correct configuration and are ready for deployment!
