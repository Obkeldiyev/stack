# STACK Project System Guide

## Overview

STACK is a family finance platform with:

- `stack`: Spring Boot backend API
- `stack-family-finance`: React frontend with Electron and Capacitor targets
- `docs`: project-level documentation and integration notes

## Core Product Flows

### Authentication
- Users register and log in through `/api/auth/*`
- Backend returns `accessToken`, optional `refreshToken`, and `user`
- Frontend stores those values in local storage and retries protected requests through refresh when possible

### Family Flow
- Parent creates a family
- Parent generates an invite code
- Child joins through QR scan or manual invite code
- Parent sees family members and can remove child accounts

### Task Flow
- Parent creates a task with a decimal reward amount
- Child completes the task and uploads a photo proof
- Parent approves or rejects the task
- Approval triggers payment to the child account

### Banking Flow
- Parent uses dashboard to transfer money to children
- Child tracks balances, savings goals, and transactions
- Goals are stored in backend smallest units and rendered as currency in the frontend

### Admin Flow
- Admin logs in with the same auth system
- Admin can:
  - view/edit users
  - enable/disable access
  - delete non-admin users
  - create/edit/delete games
  - inspect transactions
  - inspect family structures

## Frontend Architecture

### Main Areas
- Landing and presentation pages use the shared `Landing.css` visual language
- In-app dashboards use `dashboard.css`
- Admin pages use the same dashboard visual system with a dedicated admin shell

### Important Files
- `src/lib/api.ts`: API client and token refresh behavior
- `src/lib/auth.ts`: auth persistence
- `src/styles/dashboard.css`: app/admin dashboard system
- `src/components/admin/AdminShell.tsx`: shared admin shell

## Backend Architecture

### Security
- JWT filter populates the Spring Security context from bearer tokens
- Authenticated routes now require a valid bearer token
- Method security is enabled for admin/account/goal/transaction routes

### Important Packages
- `api/user`: auth and profile
- `api/family`: family creation and invites
- `api/task`: task lifecycle
- `api/bank`: accounts, goals, transactions, dashboards
- `api/game`: games and game rewards
- `api/admin`: admin endpoints and DTOs

## Current Constraints

- Game question content is still frontend-driven inside the individual game components
- Admin currently manages game metadata and rewards, not the internal quiz/question banks
- Production fixes require redeploying both backend and frontend

