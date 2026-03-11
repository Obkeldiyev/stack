# STACK Integration Possibilities

## Who This Is For

This document is for third-party developers or product teams who want to integrate STACK capabilities into another app.

## Integration Models

### 1. Embedded Family Finance Layer
Use STACK as the finance engine behind:
- parenting apps
- school reward apps
- educational platforms
- family coordination tools

### 2. Educational Reward Platform
Connect:
- lesson completion
- attendance streaks
- quiz achievements
- classroom participation

To:
- money rewards
- parent-approved allowances
- savings goals

### 3. Child Learning Ecosystem
Other child-focused apps can use STACK for:
- wallet balances
- reward payouts
- progress-linked incentives
- goal-based saving

## API Integration Basics

### Login
Get an `accessToken` from:
- `POST /api/auth/login`

### Protected Requests
Use:
- `Authorization: Bearer <accessToken>`

### Main Endpoints
- `/api/family/*`
- `/api/dashboard/*`
- `/api/tasks/*`
- `/api/accounts/*`
- `/api/goals/*`
- `/api/games/*`

## Approval Model

Integration approval is handled by the project developer.

Approval should include:
- application purpose
- expected API usage
- user roles involved
- security model
- data handling policy

## Suggested Review Checklist

- Does the integration protect family and child data?
- Does it store only what it needs?
- Does it avoid exposing admin functionality?
- Does it keep bearer tokens secure?
- Does it comply with child-data/privacy requirements?

## Recommended Future Additions

- partner API keys
- rate limiting by integration
- webhook support
- sandbox environment
- audit logs per integration

