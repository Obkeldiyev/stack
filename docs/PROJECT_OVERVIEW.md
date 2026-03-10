# STACK Kids Bank - Project Overview

## Introduction

STACK Kids Bank is a comprehensive financial education platform designed for modern families. It combines pocket money management, savings goals, spending controls, chores, rewards, and financial education in one premium product.

## Vision

To create the first money app that children will love and parents will fully trust, making financial literacy accessible and engaging for the next generation.

## Key Features

### For Parents
- **Smart Allowances**: Set automatic daily, weekly, or monthly pocket money
- **Real-time Controls**: Pause spending, limit categories, monitor transactions
- **Family Management**: Create families, invite members, manage permissions
- **Transaction Oversight**: Complete visibility of all financial activities
- **Task Management**: Create chores with rewards for children

### For Children
- **Savings Goals**: Create and track progress toward personal goals
- **Educational Games**: Learn money skills through interactive games
- **Virtual Banking**: Manage their own accounts with parental oversight
- **Reward System**: Earn coins through games and completed tasks
- **Family Connection**: Join families via QR code or invite code

### For Administrators
- **User Management**: Full control over user accounts and permissions
- **Game Management**: Create, update, and configure educational games
- **Transaction Monitoring**: System-wide financial oversight
- **Family Oversight**: View and manage all registered families
- **System Statistics**: Real-time platform analytics

## Technology Stack

### Backend
- **Framework**: Spring Boot 3.x
- **Language**: Java 21
- **Database**: PostgreSQL
- **Security**: JWT Authentication
- **API**: RESTful JSON API

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui with Tailwind CSS
- **State Management**: React Query
- **Routing**: React Router

### Mobile & Desktop
- **Mobile**: Capacitor (Android APK)
- **Desktop**: Electron (Windows EXE)
- **Web**: Progressive Web App

## Architecture

```
┌─────────────────────────────────────────────┐
│           Client Applications               │
│  (Web Browser / Android / Windows)         │
└─────────────────┬───────────────────────────┘
                  │
                  │ HTTPS/REST API
                  │
┌─────────────────▼───────────────────────────┐
│         Spring Boot Backend                 │
│  - Authentication & Authorization           │
│  - Business Logic                           │
│  - Data Validation                          │
└─────────────────┬───────────────────────────┘
                  │
                  │ JDBC
                  │
┌─────────────────▼───────────────────────────┐
│         PostgreSQL Database                 │
│  - User Data                                │
│  - Transactions                             │
│  - Family Relationships                     │
└─────────────────────────────────────────────┘
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: PARENT, CHILD, ADMIN roles
- **Password Encryption**: BCrypt hashing
- **HTTPS Only**: All communications encrypted
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Parameterized queries
