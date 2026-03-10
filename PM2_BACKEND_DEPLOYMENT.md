# Running Spring Boot Backend with PM2

## Prerequisites

### 1. Install PM2
```bash
# Install PM2 globally
npm install -g pm2

# Or using yarn
yarn global add pm2
```

### 2. Verify Java Installation
```bash
java -version
# Should show Java 21 or compatible version
```

## Deployment Steps

### 1. Build the Application
```bash
# Navigate to backend directory
cd stack

# Build the JAR file
mvn clean package -DskipTests

# Verify JAR was created
ls -la target/kidsbank-api-1.0.0.jar
```

### 2. Create PM2 Ecosystem File

Create `ecosystem.config.js` in your project root:

```javascript
module.exports = {
  apps: [{
    name: 'kidsbank-api',
    script: 'java',
    args: [
      '-jar',
      './stack/target/kidsbank-api-1.0.0.jar',
      '--server.port=8080',
      '--spring.profiles.active=production'
    ],
    cwd: './',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      JAVA_OPTS: '-Xmx512m -Xms256m'
    },
    env_production: {
      NODE_ENV: 'production',
      JAVA_OPTS: '-Xmx1024m -Xms512m'
    },
    log_file: './logs/kidsbank-api.log',
    out_file: './logs/kidsbank-api-out.log',
    error_file: './logs/kidsbank-api-error.log',
    time: true
  }]
};
```

### 3. Create Logs Directory
```bash
mkdir -p logs
```

### 4. Start with PM2

#### Option A: Using Ecosystem File (Recommended)
```bash
# Start the application
pm2 start ecosystem.config.js

# Start with specific environment
pm2 start ecosystem.config.js --env production
```

#### Option B: Direct Command
```bash
# Start directly
pm2 start java --name "kidsbank-api" -- -jar ./stack/target/kidsbank-api-1.0.0.jar --server.port=8080

# With memory limit
pm2 start java --name "kidsbank-api" --max-memory-restart 1G -- -jar ./stack/target/kidsbank-api-1.0.0.jar --server.port=8080
```

## PM2 Management Commands

### Basic Operations
```bash
# List all processes
pm2 list

# Show detailed info
pm2 show kidsbank-api

# Monitor in real-time
pm2 monit

# View logs
pm2 logs kidsbank-api

# View logs in real-time
pm2 logs kidsbank-api --lines 50 -f
```

### Process Control
```bash
# Restart the application
pm2 restart kidsbank-api

# Stop the application
pm2 stop kidsbank-api

# Delete the application
pm2 delete kidsbank-api

# Reload (zero-downtime restart)
pm2 reload kidsbank-api
```

### Auto-Start on Boot
```bash
# Generate startup script
pm2 startup

# Save current process list
pm2 save

# Resurrect saved processes
pm2 resurrect
```

## Production Configuration

### 1. Environment Variables
Create `.env` file in project root:
```bash
# Database Configuration
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/kidsbank
SPRING_DATASOURCE_USERNAME=your_db_user
SPRING_DATASOURCE_PASSWORD=your_db_password

# Server Configuration
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=production

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRATION=86400000

# Logging
LOGGING_LEVEL_ROOT=INFO
LOGGING_LEVEL_COM_KIDSBANK=DEBUG
```

### 2. Advanced Ecosystem Configuration
```javascript
module.exports = {
  apps: [{
    name: 'kidsbank-api',
    script: 'java',
    args: [
      '-jar',
      '-Dspring.profiles.active=production',
      '-Dserver.port=8080',
      './stack/target/kidsbank-api-1.0.0.jar'
    ],
    cwd: './',
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    min_uptime: '10s',
    max_restarts: 10,
    env: {
      NODE_ENV: 'production',
      JAVA_OPTS: '-Xmx1024m -Xms512m -XX:+UseG1GC'
    },
    log_file: './logs/kidsbank-api.log',
    out_file: './logs/kidsbank-api-out.log',
    error_file: './logs/kidsbank-api-error.log',
    time: true,
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
```

## Deployment Script

Create `deploy.sh`:
```bash
#!/bin/bash

echo "🚀 Deploying STACK Kids Bank API..."

# Build the application
echo "📦 Building application..."
cd stack
mvn clean package -DskipTests
cd ..

# Stop existing PM2 process
echo "🛑 Stopping existing process..."
pm2 stop kidsbank-api 2>/dev/null || true

# Start with PM2
echo "▶️ Starting with PM2..."
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

echo "✅ Deployment complete!"
echo "📊 Check status: pm2 list"
echo "📋 View logs: pm2 logs kidsbank-api"
```

Make it executable:
```bash
chmod +x deploy.sh
```

## Monitoring & Maintenance

### Health Check Script
Create `health-check.sh`:
```bash
#!/bin/bash

# Check if application is responding
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/actuator/health)

if [ $response -eq 200 ]; then
    echo "✅ Application is healthy"
    exit 0
else
    echo "❌ Application is not responding (HTTP $response)"
    echo "🔄 Restarting application..."
    pm2 restart kidsbank-api
    exit 1
fi
```

### Log Rotation
```bash
# Install PM2 log rotate module
pm2 install pm2-logrotate

# Configure log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
```bash
# Find process using port 8080
lsof -i :8080
# Kill the process
kill -9 <PID>
```

2. **Memory Issues**
```bash
# Increase memory limit
pm2 restart kidsbank-api --max-memory-restart 2G
```

3. **Database Connection Issues**
```bash
# Check database status
systemctl status postgresql
# Check logs
pm2 logs kidsbank-api --lines 100
```

### Useful Commands
```bash
# Check PM2 status
pm2 status

# Flush logs
pm2 flush

# Reset restart counter
pm2 reset kidsbank-api

# Update PM2
npm install -g pm2@latest
pm2 update
```

## Quick Start Commands

```bash
# 1. Build and deploy
./deploy.sh

# 2. Check status
pm2 list

# 3. View logs
pm2 logs kidsbank-api

# 4. Monitor
pm2 monit
```

Your Spring Boot backend will now run as a managed process with automatic restarts, logging, and monitoring capabilities!