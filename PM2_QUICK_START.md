# PM2 Quick Start Guide for STACK Kids Bank API

## 🚀 One-Click Deployment

### Windows Users
```cmd
# Run the deployment script
deploy.bat
```

### Linux/Mac Users
```bash
# Make scripts executable (first time only)
chmod +x deploy.sh health-check.sh

# Run the deployment script
./deploy.sh
```

## 📋 Essential PM2 Commands

### Check Status
```bash
# List all PM2 processes
pm2 list

# Show detailed info about your app
pm2 show kidsbank-api

# Real-time monitoring
pm2 monit
```

### View Logs
```bash
# View all logs
pm2 logs kidsbank-api

# View last 50 lines and follow
pm2 logs kidsbank-api --lines 50 -f

# View only error logs
pm2 logs kidsbank-api --err

# Clear logs
pm2 flush kidsbank-api
```

### Control Application
```bash
# Restart the app
pm2 restart kidsbank-api

# Stop the app
pm2 stop kidsbank-api

# Start the app (if stopped)
pm2 start kidsbank-api

# Delete the app from PM2
pm2 delete kidsbank-api
```

## 🔧 Manual Setup (Alternative)

If you prefer manual setup instead of using the scripts:

### 1. Install PM2
```bash
npm install -g pm2
```

### 2. Build Your Application
```bash
cd stack
mvn clean package -DskipTests
cd ..
```

### 3. Start with PM2
```bash
# Using the ecosystem file
pm2 start ecosystem.config.js

# Or start directly
pm2 start java --name "kidsbank-api" -- -jar ./stack/target/kidsbank-api-1.0.0.jar --server.port=8080
```

## 🏥 Health Monitoring

### Automatic Health Check
```bash
# Windows
health-check.bat

# Linux/Mac
./health-check.sh
```

### Manual Health Check
```bash
# Check if API is responding
curl http://localhost:8080/

# Check specific endpoint
curl http://localhost:8080/api/auth/test
```

## 🔄 Auto-Start on Server Reboot

```bash
# Generate startup script (run once)
pm2 startup

# Save current PM2 processes
pm2 save

# Your app will now start automatically on server reboot
```

## 📊 Production Monitoring

### Real-time Monitoring
```bash
# Open PM2 monitoring dashboard
pm2 monit

# Web-based monitoring (optional)
pm2 install pm2-server-monit
```

### Log Management
```bash
# Install log rotation
pm2 install pm2-logrotate

# Configure log rotation (10MB max, keep 30 files)
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

## 🛠️ Troubleshooting

### Common Issues

**1. Port 8080 already in use**
```bash
# Find what's using port 8080
netstat -ano | findstr :8080

# Kill the process (Windows)
taskkill /PID <PID> /F

# Kill the process (Linux/Mac)
kill -9 <PID>
```

**2. Application won't start**
```bash
# Check PM2 logs
pm2 logs kidsbank-api

# Check if Java is installed
java -version

# Check if JAR file exists
ls -la stack/target/kidsbank-api-1.0.0.jar
```

**3. Out of memory errors**
```bash
# Restart with more memory
pm2 delete kidsbank-api
pm2 start ecosystem.config.js --env production
```

### Useful Commands
```bash
# Restart PM2 daemon
pm2 kill
pm2 resurrect

# Update PM2
npm install -g pm2@latest
pm2 update

# Reset restart counter
pm2 reset kidsbank-api
```

## 🎯 Quick Reference

| Command | Description |
|---------|-------------|
| `pm2 list` | Show all processes |
| `pm2 logs kidsbank-api` | View logs |
| `pm2 monit` | Real-time monitoring |
| `pm2 restart kidsbank-api` | Restart app |
| `pm2 stop kidsbank-api` | Stop app |
| `pm2 delete kidsbank-api` | Remove app |
| `pm2 save` | Save current processes |
| `pm2 startup` | Enable auto-start |

## 🌐 Access Your API

Once deployed, your API will be available at:
- **Local**: http://localhost:8080
- **Server**: http://your-server-ip:8080

### Test Endpoints
```bash
# Health check
curl http://localhost:8080/

# API test
curl http://localhost:8080/api/auth/test
```

## 📝 Configuration Files

- `ecosystem.config.js` - PM2 configuration
- `deploy.bat` / `deploy.sh` - Deployment scripts
- `health-check.bat` / `health-check.sh` - Health monitoring
- `logs/` - Application logs directory

Your Spring Boot backend is now running as a production-ready service with PM2! 🎉