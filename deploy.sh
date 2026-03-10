#!/bin/bash

echo "🚀 Deploying STACK Kids Bank API on Ubuntu Server..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    if ! command -v java &> /dev/null; then
        print_error "Java is not installed. Please run server-setup.sh first."
        exit 1
    fi
    
    if ! command -v mvn &> /dev/null; then
        print_error "Maven is not installed. Please run server-setup.sh first."
        exit 1
    fi
    
    if ! command -v pm2 &> /dev/null; then
        print_error "PM2 is not installed. Please run server-setup.sh first."
        exit 1
    fi
    
    print_success "All requirements satisfied"
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    mkdir -p logs
    mkdir -p uploads
    mkdir -p backups
    print_success "Directories created"
}

# Check environment configuration
check_environment() {
    print_status "Checking environment configuration..."
    
    if [ ! -f ".env" ]; then
        print_warning ".env file not found. Creating from template..."
        cp production.env .env
        print_warning "Please edit .env file with your configuration before continuing."
        read -p "Press Enter after editing .env file..."
    fi
    
    # Source environment variables
    if [ -f ".env" ]; then
        export $(cat .env | grep -v '^#' | xargs)
    fi
    
    print_success "Environment configuration loaded"
}

# Build the application
build_application() {
    print_status "Building application..."
    cd stack
    
    # Clean and compile
    mvn clean package -DskipTests
    
    if [ $? -ne 0 ]; then
        print_error "Build failed!"
        exit 1
    fi
    
    print_success "Build successful!"
    cd ..
    
    # Check if JAR file exists
    if [ ! -f "stack/target/kidsbank-api-1.0.0.jar" ]; then
        print_error "JAR file not found!"
        exit 1
    fi
    
    print_success "JAR file created: stack/target/kidsbank-api-1.0.0.jar"
}

# Deploy with PM2
deploy_with_pm2() {
    print_status "Deploying with PM2..."
    
    # Stop existing PM2 process
    print_status "Stopping existing process..."
    pm2 stop kidsbank-api 2>/dev/null || true
    pm2 delete kidsbank-api 2>/dev/null || true
    
    # Start with PM2
    print_status "Starting with PM2..."
    pm2 start ecosystem.config.js --env production
    
    if [ $? -eq 0 ]; then
        print_success "Application started successfully!"
        
        # Save PM2 configuration
        pm2 save
        
        # Setup PM2 startup script (if not already done)
        if ! pm2 startup | grep -q "already"; then
            print_status "Setting up PM2 startup script..."
            pm2 startup | grep "sudo" | bash
            pm2 save
        fi
        
    else
        print_error "Failed to start application!"
        exit 1
    fi
}

# Health check
health_check() {
    print_status "Performing health check..."
    
    # Wait for application to start
    sleep 10
    
    # Check if application is responding
    for i in {1..30}; do
        if curl -s http://localhost:8080/ > /dev/null 2>&1; then
            print_success "Application is responding!"
            break
        elif [ $i -eq 30 ]; then
            print_error "Application is not responding after 30 attempts"
            print_status "Checking logs..."
            pm2 logs kidsbank-api --lines 20
            exit 1
        else
            print_status "Waiting for application to start... (attempt $i/30)"
            sleep 2
        fi
    done
}

# Display status
show_status() {
    print_success "🎉 Deployment completed successfully!"
    echo ""
    echo "📊 Application Status:"
    pm2 list
    echo ""
    echo "🔗 Application URLs:"
    echo "  - Local: http://localhost:8080"
    echo "  - Server: http://$(curl -s ifconfig.me):8080"
    echo ""
    echo "📋 Useful Commands:"
    echo "  - View logs: pm2 logs kidsbank-api"
    echo "  - Monitor: pm2 monit"
    echo "  - Restart: pm2 restart kidsbank-api"
    echo "  - Stop: pm2 stop kidsbank-api"
    echo "  - Health check: ./health-check.sh"
    echo ""
    echo "📁 Important Files:"
    echo "  - Logs: ./logs/"
    echo "  - Uploads: ./uploads/"
    echo "  - Config: .env"
    echo "  - JAR: stack/target/kidsbank-api-1.0.0.jar"
}

# Main deployment process
main() {
    check_requirements
    create_directories
    check_environment
    build_application
    deploy_with_pm2
    health_check
    show_status
}

# Run main function
main