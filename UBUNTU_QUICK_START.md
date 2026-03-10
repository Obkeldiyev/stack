# Ubuntu Server 24.04 Quick Start Guide

## 🚀 One-Command Setup

### 1. Initial Server Setup
```bash
# Make setup script executable and run
chmod +x server-setup.sh
./server-setup.sh
```

### 2. Deploy Application
```bash
# Upload your project files to /opt/kidsbank
cd /opt/kidsbank

# Make deployment script executable
chmod +x deploy.sh health-check.sh

# Configure environment
cp production.env .env
nano .env  # Edit with your settings

# Deploy the application
./deploy.sh
```

### 3. Verify Deployment
```bash
# Check application health
./health-check.sh

# View PM2 status
pm2 list

# Test API endpoint
curl http://localhost:8080/
```

## 📋 Essential Commands

### PM2 Management
```bash
# View all processes
pm2 list

# View logs in real-time
pm2 logs kidsbank-api -f

# Restart application
pm2 restart kidsbank-api

# Stop application
pm2 stop kidsbank-api

# Monitor resources
pm2 monit
```

### System Monitoring
```bash
# Check system resources
htop

# Check disk usage
df -h

# Check memory usage
free -h

# Check network connections
netstat -tulpn | grep :8080
```

### Database Management
```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Connect to your database
sudo -u postgres psql -d kidsbank

# Check database status
sudo systemctl status postgresql
```

## 🔧 Configuration Files

### Environment Variables (.env)
```bash
# Edit environment configuration
nano .env

# Key settings to configure:
# - Database connection
# - JWT secret
# - Server port
# - CORS origins
```

### PM2 Configuration (ecosystem.config.js)
```bash
# View current PM2 config
cat ecosystem.config.js

# Restart with new config
pm2 restart ecosystem.config.js
```

## 🌐 Nginx Setup (Optional)

### Install and Configure Nginx
```bash
# Install Nginx
sudo apt install nginx -y

# Copy configuration template
sudo cp nginx-config.template /etc/nginx/sites-available/kidsbank-api

# Edit configuration
sudo nano /etc/nginx/sites-available/kidsbank-api

# Enable site
sudo ln -s /etc/nginx/sites-available/kidsbank-api /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### SSL Certificate with Let's Encrypt
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal is configured automatically
```

## 🛠️ Troubleshooting

### Application Issues
```bash
# Check if application is running
pm2 list

# View detailed logs
pm2 logs kidsbank-api --lines 100

# Check Java process
ps aux | grep java

# Test database connection
sudo -u postgres psql -d kidsbank -c "SELECT version();"
```

### Port Issues
```bash
# Check what's using port 8080
sudo lsof -i :8080

# Kill process using port
sudo kill -9 <PID>

# Check firewall
sudo ufw status
```

### Memory Issues
```bash
# Check memory usage
free -h

# Check Java heap usage
jstat -gc <java_pid>

# Restart with more memory
pm2 restart kidsbank-api
```

### Database Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql

# Check database logs
sudo tail -f /var/log/postgresql/postgresql-*.log
```

## 📊 Monitoring & Maintenance

### Log Management
```bash
# View application logs
pm2 logs kidsbank-api

# View system logs
sudo journalctl -u postgresql -f

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Backup Database
```bash
# Create database backup
sudo -u postgres pg_dump kidsbank > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore database backup
sudo -u postgres psql kidsbank < backup_file.sql
```

### Update Application
```bash
# Pull latest code (if using git)
git pull origin main

# Rebuild and redeploy
./deploy.sh

# Check deployment
./health-check.sh
```

## 🔄 Auto-Start Configuration

### PM2 Auto-Start
```bash
# Generate startup script
pm2 startup

# Save current processes
pm2 save

# Test auto-start
sudo reboot
# After reboot, check: pm2 list
```

### Service Status Check
```bash
# Check all services
sudo systemctl status postgresql nginx

# Enable services for auto-start
sudo systemctl enable postgresql nginx
```

## 🎯 Quick Reference

| Task | Command |
|------|---------|
| Deploy app | `./deploy.sh` |
| Check health | `./health-check.sh` |
| View logs | `pm2 logs kidsbank-api` |
| Restart app | `pm2 restart kidsbank-api` |
| Monitor system | `htop` |
| Check database | `sudo -u postgres psql -d kidsbank` |
| Test API | `curl http://localhost:8080/` |
| Nginx status | `sudo systemctl status nginx` |

## 🌐 Access Points

- **Direct API**: http://your-server-ip:8080
- **With Nginx**: http://your-domain.com
- **With SSL**: https://your-domain.com
- **Health Check**: http://your-server-ip:8080/actuator/health

## 📱 Production Checklist

- [ ] Server setup completed (`./server-setup.sh`)
- [ ] Environment configured (`.env` file)
- [ ] Application deployed (`./deploy.sh`)
- [ ] Health check passed (`./health-check.sh`)
- [ ] PM2 auto-start configured (`pm2 startup && pm2 save`)
- [ ] Firewall configured (`sudo ufw status`)
- [ ] Nginx configured (optional)
- [ ] SSL certificate installed (optional)
- [ ] Database backup scheduled
- [ ] Monitoring setup

Your STACK Kids Bank API is now running on Ubuntu Server 24.04! 🎉