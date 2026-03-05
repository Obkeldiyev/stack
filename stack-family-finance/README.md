# STACK Kids Bank

A family finance management application for parents and children to manage allowances, tasks, goals, and learn financial literacy.

## Features

- **Parent Dashboard**: Create families, manage children, assign tasks, track progress
- **Child Dashboard**: View tasks, set goals, play educational games, earn rewards
- **Family Management**: Invite system for connecting parents and children
- **Games**: Educational games to earn coins and learn financial concepts
- **Tasks & Goals**: Set and track financial goals and complete tasks for rewards
- **Accounts**: Manage virtual bank accounts with transactions

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.x
- PostgreSQL
- JWT Authentication
- Maven

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- Shadcn/ui Components
- React Router
- TanStack Query

### Desktop
- Electron
- electron-builder

### Mobile
- Capacitor
- Android support

## Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL 14+
- Maven 3.8+

### Backend Setup

1. Create PostgreSQL database:
```sql
CREATE DATABASE kidsbank;
```

2. Update database credentials in `stack/src/main/resources/application.yml`

3. Run the backend:
```bash
cd stack
mvn spring-boot:run
```

Backend will run on `http://localhost:8080`

### Frontend Setup

1. Install dependencies:
```bash
cd stack-family-finance
npm install
```

2. Create `.env` file:
```
VITE_API_BASE_URL=http://localhost:8080
```

3. Run development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## Building

### Web Build
```bash
npm run build
```

### Desktop Build
```bash
npm run electron:build
npm run electron:pack
```

### Mobile Build
```bash
npm run mobile:init
npm run mobile:add:android
npm run mobile:build
npm run mobile:open:android
```

## Documentation

See the following guides for more information:
- `FINAL_TEST.md` - Testing guide
- `BUILD_RESULTS.md` - Build information
- `DEPLOYMENT.md` - Deployment guide
- `SETUP_INSTRUCTIONS.md` - Detailed setup

## License

Private project - All rights reserved

## Architecture

### Authentication Flow
- JWT-based authentication
- Role-based access control (PARENT/CHILD)
- Separate registration for parents and children
- Family invite system for connecting accounts

### Parent-Child Relationship
- Parents create families
- Parents generate invite codes
- Children join families using invite codes
- Parents can manage children's tasks and goals

## Support

For issues or questions, please refer to the documentation files in the project root.
