#!/bin/bash

echo "🏥 Checking STACK Kids Bank API health..."

# Wait a moment for the application to start
sleep 5

# Check if application is responding
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/actuator/health 2>/dev/null)

if [ -z "$response" ]; then
    # If actuator endpoint doesn't exist, try a basic endpoint
    response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/ 2>/dev/null)
fi

if [ "$response" = "200" ] || [ "$response" = "404" ]; then
    echo "✅ Application is healthy (HTTP $response)"
    echo "🔗 API is running at: http://localhost:8080"
    
    # Show PM2 status
    echo ""
    echo "📊 PM2 Status:"
    pm2 list | grep kidsbank-api
    
    exit 0
else
    echo "❌ Application is not responding (HTTP $response)"
    echo "📋 Checking logs..."
    pm2 logs kidsbank-api --lines 10
    
    echo ""
    echo "🔄 Attempting to restart application..."
    pm2 restart kidsbank-api
    
    echo "⏳ Waiting for restart..."
    sleep 10
    
    # Check again after restart
    response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/ 2>/dev/null)
    if [ "$response" = "200" ] || [ "$response" = "404" ]; then
        echo "✅ Application recovered after restart"
        exit 0
    else
        echo "❌ Application still not responding after restart"
        exit 1
    fi
fi