# STACK Kids Bank - Integration Guide

## Overview

STACK Kids Bank provides a comprehensive REST API that allows third-party applications to integrate with our platform. This guide covers authentication, available endpoints, and integration patterns.

## Getting Started

### 1. Developer Registration

To integrate with STACK Kids Bank, you need to:
1. Contact the developer at [your-email@domain.com]
2. Provide your application details
3. Receive API credentials and approval

### 2. Authentication

All API requests require JWT authentication:

```javascript
// Login to get token
const response = await fetch('https://stack.polito.uz/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'your_username',
    password: 'your_password'
  })
});

const { data } = await response.json();
const token = data.token;

// Use token in subsequent requests
const apiResponse = await fetch('https://stack.polito.uz/api/accounts/me', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### 3. API Base URL

```
Production: https://stack.polito.uz
Staging: https://staging.stack.polito.uz (if available)
```

## Integration Patterns

### Family Banking Integration

Perfect for:
- Educational apps wanting to add financial features
- Parental control applications
- Family management platforms

```javascript
// Example: Get family accounts
async function getFamilyAccounts(familyId) {
  const response = await fetch(`/api/accounts/family/${familyId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
}

// Example: Transfer money
async function sendAllowance(childId, amount, note) {
  const response = await fetch('/api/accounts/transfer', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ childId, amount, note })
  });
  return response.json();
}
```

### Educational Game Integration

Perfect for:
- Learning management systems
- Educational game platforms
- Reward-based applications

```javascript
// Example: Start a game session
async function startGame(gameId) {
  const response = await fetch(`/api/games/start/${gameId}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
}

// Example: Complete game and award coins
async function completeGame(sessionId, score) {
  const response = await fetch(`/api/games/finish/${sessionId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ scorePoints: score })
  });
  return response.json();
}
```

## Available Endpoints

### Core Endpoints
- `POST /api/auth/login` - Authentication
- `GET /api/accounts/me` - Get user accounts
- `GET /api/family/me` - Get user families
- `POST /api/accounts/transfer` - Transfer money
- `GET /api/transactions/accounts/{id}` - Transaction history

### Game Endpoints
- `GET /api/games/public/list` - List available games
- `POST /api/games/start/{gameId}` - Start game session
- `POST /api/games/finish/{sessionId}` - Complete game

### Goal Endpoints
- `GET /api/goals/me` - Get user goals
- `POST /api/goals/me` - Create new goal
- `POST /api/goals/{id}/save` - Save money to goal

## Rate Limits

- 100 requests per minute per API key
- 1000 requests per hour per API key
- Burst limit: 10 requests per second

## Error Handling

```javascript
try {
  const response = await fetch('/api/accounts/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      // Token expired, need to re-authenticate
      throw new Error('Authentication required');
    } else if (response.status === 429) {
      // Rate limit exceeded
      throw new Error('Rate limit exceeded');
    } else {
      throw new Error(`API error: ${response.status}`);
    }
  }
  
  const data = await response.json();
  return data;
} catch (error) {
  console.error('API request failed:', error);
  throw error;
}
```

## Webhooks (Future Feature)

Coming soon: Real-time notifications for:
- New transactions
- Goal completions
- Family member activities
- Game achievements

## Support

For integration support:
- Email: [your-email@domain.com]
- Documentation: This guide
- Response time: 24-48 hours

## Terms of Use

By integrating with STACK Kids Bank API:
1. You agree to handle user data securely
2. You will not store sensitive financial information
3. You will comply with applicable privacy laws
4. You will provide proper attribution to STACK Kids Bank
5. Integration approval is required before production use

## Developer Approval Process

1. **Application**: Submit integration proposal
2. **Review**: Technical and security review (3-5 business days)
3. **Testing**: Sandbox access for development
4. **Approval**: Production API access granted
5. **Monitoring**: Ongoing usage monitoring

Contact developer for approval: [your-email@domain.com]