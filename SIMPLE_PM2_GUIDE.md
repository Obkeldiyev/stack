# Simple PM2 Deployment Guide

## 🚀 Quick Start

### 1. Navigate to Backend Directory
```bash
cd stack
```

### 2. Start with PM2
```bash
pm2 start "mvn spring-boot:run" --name stack
```

That's it! Your Spring Boot application is now running with PM2.

## 📋 Essential PM2 Commands

### Check Status
```bash
pm2 list
pm2 show stack
```

### View Logs
```bash
pm2 logs stack
pm2 logs stack -f  # Follow logs in real-time
```

### Control Application
```bash
pm2 restart stack
pm2 stop stack
pm2 delete stack
```

### Monitor
```bash
pm2 monit
```

## 🔄 Auto-Start on Server Reboot

```bash
# Generate startup script (run once)
pm2 startup

# Save current processes
pm2 save
```

## 🛠️ Troubleshooting

### If Port 8080 is Already in Use
```bash
# Find what's using port 8080
sudo lsof -i :8080

# Kill the process
sudo kill -9 <PID>
```

### If Application Won't Start
```bash
# Check logs
pm2 logs stack

# Check if Java/Maven are installed
java -version
mvn -version

# Try running manually first
mvn spring-boot:run
```

### Restart After Code Changes
```bash
pm2 restart stack
```

## 🌐 Access Your API

Once running, your API will be available at:
- http://localhost:8080
- http://your-server-ip:8080

### Test It
```bash
curl http://localhost:8080/
```

## 📊 Quick Reference

| Command | Description |
|---------|-------------|
| `pm2 start "mvn spring-boot:run" --name stack` | Start application |
| `pm2 list` | Show all processes |
| `pm2 logs stack` | View logs |
| `pm2 restart stack` | Restart app |
| `pm2 stop stack` | Stop app |
| `pm2 delete stack` | Remove from PM2 |
| `pm2 monit` | Real-time monitoring |

That's all you need! Simple and effective. 🎉