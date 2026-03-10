#!/bin/bash

echo "🖥️ Setting up Ubuntu Server 24.04 for STACK Kids Bank API..."

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

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_error "Please don't run this script as root. Use a regular user with sudo privileges."
    exit 1
fi

# Update system
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y
print_success "System updated successfully"

# Install Java 21
print_status "Installing Java 21..."
if ! command -v java &> /dev/null; then
    sudo apt install openjdk-21-jdk -y
    
    # Set JAVA_HOME
    export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
    echo 'export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64' >> ~/.bashrc
    
    print_success "Java 21 installed successfully"
    java -version
else
    print_success "Java is already installed"
    java -version
fi

# Install Maven
print_status "Installing Maven..."
if ! command -v mvn &> /dev/null; then
    sudo apt install maven -y
    print_success "Maven installed successfully"
    mvn -version
else
    print_success "Maven is already installed"
    mvn -version
fi

# Install Node.js and npm
print_status "Installing Node.js 20.x LTS..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
    print_success "Node.js installed successfully"
    node -v
    npm -v
else
    print_success "Node.js is already installed"
    node -v
    npm -v
fi

# Install PM2
print_status "Installing PM2..."
if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
    print_success "PM2 installed successfully"
    pm2 -v
else
    print_success "PM2 is already installed"
    pm2 -v
fi

# Install PostgreSQL
print_status "Installing PostgreSQL..."
if ! command -v psql &> /dev/null; then
    sudo apt install postgresql postgresql-contrib -y
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    print_success "PostgreSQL installed successfully"
    
    print_warning "Please configure PostgreSQL database manually:"
    echo "sudo -u postgres psql -c \"CREATE DATABASE kidsbank;\""
    echo "sudo -u postgres psql -c \"CREATE USER kidsbank_user WITH PASSWORD 'your_secure_password';\""
    echo "sudo -u postgres psql -c \"GRANT ALL PRIVILEGES ON DATABASE kidsbank TO kidsbank_user;\""
else
    print_success "PostgreSQL is already installed"
fi

# Install additional tools
print_status "Installing additional tools..."
sudo apt install curl wget git htop nano ufw -y
print_success "Additional tools installed"

# Configure firewall
print_status "Configuring UFW firewall..."
sudo ufw --force enable
sudo ufw allow ssh
sudo ufw allow 8080
sudo ufw allow 80
sudo ufw allow 443
print_success "Firewall configured"

# Create project directory
print_status "Creating project directory..."
sudo mkdir -p /opt/kidsbank
sudo chown $USER:$USER /opt/kidsbank
print_success "Project directory created at /opt/kidsbank"

# Install Nginx (optional)
read -p "Do you want to install Nginx as reverse proxy? (y/n): " install_nginx
if [[ $install_nginx =~ ^[Yy]$ ]]; then
    print_status "Installing Nginx..."
    sudo apt install nginx -y
    sudo systemctl start nginx
    sudo systemctl enable nginx
    print_success "Nginx installed and started"
fi

print_success "🎉 Server setup completed!"
echo ""
echo "Next steps:"
echo "1. Upload your project files to /opt/kidsbank"
echo "2. Configure database connection in .env file"
echo "3. Run ./deploy.sh to build and start your application"
echo "4. Configure Nginx reverse proxy if needed"
echo ""
echo "Useful commands:"
echo "- pm2 list                    # View running processes"
echo "- pm2 logs kidsbank-api      # View application logs"
echo "- pm2 monit                  # Real-time monitoring"
echo "- sudo systemctl status nginx # Check Nginx status"