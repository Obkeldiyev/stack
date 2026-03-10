# Ubuntu Server 24.04 Deployment Guide

## 🖥️ Server Setup for STACK Kids Bank API

### Prerequisites Installation

#### 1. Update System
```bash
sudo apt update && sudo apt upgrade -y
```

#### 2. Install Java 21 (OpenJDK)
```bash
# Install OpenJDK 21
sudo apt install openjdk-21-jdk -y

# Verify installation
java -version
javac -version

# Set JAVA_HOME (add to ~/.bashrc for persistence)
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
echo 'export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64' >> ~/.bashrc
```

#### 3. Install Maven
```bash
# Install Maven
sudo apt install maven -y

# Verify installation
mvn -version
```

#### 4. Install Node.js and npm (for PM2)
```bash
# Install Node.js 20.x LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node -v
npm -v
```

#### 5. Install PM2
```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify installation
pm2 -v
```

#### 6. Install PostgreSQL (if not already installed)
```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql -c "CREATE DATABASE kidsbank;"
sudo -u postgres psql -c "CREATE USER kidsbank_user WITH PASSWORD 'your_secure_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE kidsbank TO kidsbank_user;"
```

## 🚀 Deployment Process

### 1. Upload Your Project
```bash
# Create project directory
sudo mkdir -p /opt/kidsbank
sudo chown $USER:$USER /opt/kidsbank
cd /opt/kidsbank

# Upload your project files here (using scp, git, etc.)
# Example with git:
# git clone https://your-repo-url.git .
```

### 2. Configure Environment
```bash
# Create environment file
nano .env
```

Add the following to `.env`:
```bash
# Database Configuration
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/kidsbank
SPRING_DATASOURCE_USERNAME=kidsbank_user
SPRING_DATASOURCE_PASSWORD=your_secure_password

# Server Configuration
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=production

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=86400000

# Logging
LOGGING_LEVEL_ROOT=INFO
LOGGING_LEVEL_COM_KIDSBANK=DEBUG
```

### 3. Build the Application
```bash
# Navigate to backend directory
cd /opt/kidsbank/stack

# Build the application
mvn clean package -DskipTests

# Verify JAR was created
ls -la target/kidsbank-api-1.0.0.jar
```

### 4. Deploy with PM2
```bash
# Go back to project root
cd /opt/kidsbank

# Make deployment script executable
chmod +x deploy.sh health-check.sh

# Run deployment
./deploy.sh
```

## 🔧 Production Configuration

### 1. Create Systemd Service (Alternative to PM2)
If you prefer systemd over PM2, create a service file:

```bash
sudo nano /etc/systemd/system/kidsbank-api.service
```

Add the following content:
```ini
[Unit]
Description=STACK Kids Bank API
After=network.target postgresql.service

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/opt/kidsbank
ExecStart=/usr/bin/java -jar -Dspring.profiles.active=production /opt/kidsbank/stack/target/kidsbank-api-1.0.0.jar
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=kidsbank-api
Environment=JAVA_OPTS=-Xmx1024m -Xms512m

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable kidsbank-api
sudo systemctl start kidsbank-api
sudo systemctl status kidsbank-api
```

### 2. Configure Firewall
```bash
# Enable UFW firewall
sudo ufw enable

# Allow SSH (important!)
sudo ufw allow ssh

# Allow HTTP and HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Allow your API port
sudo ufw allow 8080

# Check status
sudo ufw status
```

### 3. Install and Configure Nginx (Reverse Proxy)
```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/kidsbank-api
```

Add the following configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support (if needed)
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

Enable the site:
```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/kidsbank-api /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### 4. SSL Certificate with Let's Encrypt (Optional)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate (replace with your domain)
sudo certbot --nginx -d your-domain.com

# Auto-renewal is set up automatically
sudo systemctl status certbot.timer
```

## 📊 Monitoring and Maintenance

### 1. PM2 Monitoring
```bash
# View PM2 processes
pm2 list

# Monitor in real-time
pm2 monit

# View logs
pm2 logs kidsbank-api

# Restart application
pm2 restart kidsbank-api
```

### 2. System Monitoring
```bash
# Install htop for system monitoring
sudo apt install htop -y

# Check system resources
htop

# Check disk usage
df -h

# Check memory usage
free -h

# Check running processes
ps aux | grep java
```

### 3. Log Management
```bash
# View application logs (if using systemd)
sudo journalctl -u kidsbank-api -f

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Rotate logs (PM2 handles this automatically)
pm2 install pm2-logrotate
```

## 🔄 Auto-Start Configuration

### For PM2:
```bash
# Generate startup script
pm2 startup

# Save current processes
pm2 save
```

### For Systemd:
```bash
# Enable auto-start
sudo systemctl enable kidsbank-api
```

## 🛠️ Troubleshooting

### Common Issues:

1. **Port 8080 already in use:**
```bash
sudo lsof -i :8080
sudo kill -9 <PID>
```

2. **Java not found:**
```bash
which java
echo $JAVA_HOME
sudo update-alternatives --config java
```

3. **Database connection issues:**
```bash
sudo systemctl status postgresql
sudo -u postgres psql -c "\l"
```

4. **Permission issues:**
```bash
sudo chown -R $USER:$USER /opt/kidsbank
chmod +x deploy.sh health-check.sh
```

## 🚀 Quick Deployment Commands

```bash
# Complete deployment from scratch
cd /opt/kidsbank
git pull origin main  # if using git
./deploy.sh
./health-check.sh

# Check everything is running
pm2 list
sudo systemctl status nginx
curl http://localhost:8080/
```

## 📱 Access Your API

- **Local**: http://localhost:8080
- **Server IP**: http://your-server-ip:8080
- **Domain** (with Nginx): http://your-domain.com
- **HTTPS** (with SSL): https://your-domain.com

Your STACK Kids Bank API is now running on Ubuntu Server 24.04! 🎉