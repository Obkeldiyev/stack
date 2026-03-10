# STACK Kids Bank - API Reference

## Base URL
```
Production: https://stack.polito.uz
Development: http://localhost:8080
```

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Authentication Endpoints

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "string",
  "password": "string",
  "role": "PARENT" | "CHILD"
}

Response: 200 OK
{
  "message": "User registered successfully",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": 1,
      "username": "john_doe",
      "role": "PARENT",
      "enabled": true
    }
  }
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}

Response: 200 OK
{
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": 1,
      "username": "john_doe",
      "role": "PARENT",
      "enabled": true
    }
  }
}
```

## Family Endpoints

### Create Family
```http
POST /api/family/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Smith Family"
}

Response: 200 OK
{
  "message": "Family created",
  "data": {
    "id": 1,
    "title": "Smith Family",
    "createdBy": 1,
    "createdAt": "2026-03-10T10:00:00Z"
  }
}
```

### Generate Invite Code
```http
POST /api/family/{familyId}/invite
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Invite code generated",
  "data": {
    "code": "ABC123",
    "inviteCode": "ABC123"
  }
}
```

### Join Family
```http
POST /api/family/join
Authorization: Bearer <token>
Content-Type: application/json

{
  "code": "ABC123"
}

Response: 200 OK
{
  "message": "Joined family successfully",
  "data": null
}
```

### Get My Families
```http
GET /api/family/me
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Families retrieved",
  "data": [
    {
      "id": 1,
      "title": "Smith Family",
      "createdBy": 1,
      "createdAt": "2026-03-10T10:00:00Z"
    }
  ]
}
```

## Account Endpoints

### Get My Accounts
```http
GET /api/accounts/me
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Accounts retrieved",
  "data": [
    {
      "id": 1,
      "userId": 1,
      "accountType": "CHECKING",
      "balance": 100.50,
      "createdAt": "2026-03-10T10:00:00Z"
    }
  ]
}
```

### Transfer Money
```http
POST /api/accounts/transfer
Authorization: Bearer <token> (PARENT only)
Content-Type: application/json

{
  "childId": 2,
  "amount": 10.00,
  "note": "Weekly allowance"
}

Response: 200 OK
```