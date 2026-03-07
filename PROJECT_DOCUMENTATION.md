# 📚 STACK Kids Bank - Complete Project Documentation

## 🎯 Project Overview

STACK Kids Bank is a comprehensive family banking application designed to teach children financial literacy through gamification. Parents can manage family finances, assign tasks, set allowances, and transfer money to their children. Children can earn money through tasks and games, set savings goals, and learn about money management in a safe, controlled environment.

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Applications                      │
├──────────────┬──────────────┬──────────────┬────────────────┤
│  Desktop App │   Web App    │  Android App │   iOS App      │
│  (Electron)  │   (React)    │  (Capacitor) │  (Capacitor)   │
└──────────────┴──────────────┴──────────────┴────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   REST API       │
                    │   (HTTP/JSON)    │
                    └──────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend Server                          │
│                   (Spring Boot + Java)                       │
├──────────────┬──────────────┬──────────────┬────────────────┤
│ Auth Service │ Bank Service │ Game Service │ Family Service │
└──────────────┴──────────────┴──────────────┴────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   PostgreSQL     │
                    │   Database       │
                    └──────────────────┘
```

### Technology Stack

#### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: React Query (TanStack Query)
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **Desktop**: Electron
- **Mobile**: Capacitor

#### Backend
- **Framework**: Spring Boot 3.x
- **Language**: Java 17
- **Database**: PostgreSQL
- **ORM**: Spring Data JPA (Hibernate)
- **Security**: Spring Security + JWT
- **Migration**: Flyway
- **Build Tool**: Maven
- **API Style**: RESTful

#### DevOps & Tools
- **Version Control**: Git
- **Package Manager**: npm (frontend), Maven (backend)
- **Testing**: Vitest (frontend), JUnit (backend)
- **Code Quality**: ESLint, Prettier

---

## 📁 Project Structure

### Frontend Structure

```
stack-family-finance/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── games/          # Game components
│   │   │   ├── MathRush.tsx
│   │   │   ├── MemoryCards.tsx
│   │   │   ├── SmartQuiz.tsx
│   │   │   ├── WordScramble.tsx
│   │   │   └── NumberGuess.tsx
│   │   ├── layout/         # Layout components
│   │   └── ui/             # shadcn/ui components
│   ├── pages/              # Page components
│   │   ├── parent/         # Parent-specific pages
│   │   │   ├── BankingDashboard.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── Family.tsx
│   │   ├── child/          # Child-specific pages
│   │   │   ├── BankingDashboard.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Family.tsx
│   │   │   ├── Games.tsx
│   │   │   └── GamePlay.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── Settings.tsx
│   ├── lib/                # Utility libraries
│   │   ├── api.ts          # API client
│   │   ├── auth.ts         # Authentication utilities
│   │   ├── types.ts        # TypeScript types
│   │   ├── utils.ts        # Helper functions
│   │   ├── theme.ts        # Theme management
│   │   └── notifications.ts # Notification utilities
│   ├── hooks/              # Custom React hooks
│   ├── data/               # Static data
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── electron/               # Electron configuration
│   ├── main.ts             # Electron main process
│   └── preload.ts          # Preload script
├── android/                # Android project (Capacitor)
├── public/                 # Static assets
├── dist/                   # Build output
├── package.json            # Dependencies
├── vite.config.ts          # Vite configuration
├── tailwind.config.ts      # Tailwind configuration
├── capacitor.config.ts     # Capacitor configuration
└── electron-builder.yml    # Electron builder config
```

### Backend Structure

```
stack/
├── src/main/java/com/kidsbank/api/
│   ├── bank/               # Banking domain
│   │   ├── Account.java
│   │   ├── AccountController.java
│   │   ├── AccountRepository.java
│   │   ├── AccountService.java
│   │   ├── Transaction.java
│   │   ├── TransactionController.java
│   │   ├── TransactionService.java
│   │   ├── Goal.java
│   │   ├── GoalController.java
│   │   ├── GoalService.java
│   │   ├── TaskItem.java
│   │   ├── TaskController.java
│   │   ├── TaskService.java
│   │   ├── DashboardController.java
│   │   └── BankDtos.java
│   ├── family/             # Family domain
│   │   ├── Family.java
│   │   ├── FamilyController.java
│   │   ├── FamilyService.java
│   │   ├── FamilyMember.java
│   │   ├── FamilyInvite.java
│   │   └── FamilyDtos.java
│   ├── game/               # Game domain
│   │   ├── Game.java
│   │   ├── GameController.java
│   │   ├── GameService.java
│   │   ├── GameSession.java
│   │   └── GameDtos.java
│   ├── user/               # User domain
│   │   ├── User.java
│   │   ├── UserRepository.java
│   │   ├── UserService.java
│   │   ├── AuthController.java
│   │   └── AuthDtos.java
│   ├── security/           # Security configuration
│   │   ├── SecurityConfig.java
│   │   ├── JwtService.java
│   │   └── JwtAuthFilter.java
│   ├── config/             # Application configuration
│   │   └── CorsConfig.java
│   ├── common/             # Common utilities
│   │   ├── ApiResponse.java
│   │   ├── GlobalExceptionHandler.java
│   │   ├── NotFoundException.java
│   │   └── BadRequestException.java
│   └── KidsBankApiApplication.java
├── src/main/resources/
│   ├── application.yml     # Application configuration
│   └── db/migration/       # Database migrations
│       └── V1_init.sql
├── src/test/               # Tests
├── pom.xml                 # Maven configuration
└── target/                 # Build output
```

---

## 🔐 Authentication & Security

### JWT Authentication Flow

```
1. User Registration/Login
   ↓
2. Backend validates credentials
   ↓
3. Backend generates JWT token
   ↓
4. Frontend stores token in localStorage
   ↓
5. Frontend includes token in Authorization header
   ↓
6. Backend validates token on each request
   ↓
7. Backend extracts userId from token
   ↓
8. Backend processes request with user context
```

### Security Implementation

**Backend (Spring Security):**
```java
// JWT Token Structure
{
  "sub": "userId",
  "iat": 1234567890,
  "exp": 1234567890
}

// Security Filter Chain
1. JwtAuthFilter extracts token
2. JwtService validates token
3. UsernamePasswordAuthenticationToken created
4. SecurityContext updated with authentication
5. Request proceeds to controller
```

**Frontend (React):**
```typescript
// Token Storage
localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(user));

// API Interceptor
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Role-Based Access Control (RBAC)

**Roles:**
- `PARENT`: Full access to family management, money transfers, task assignment
- `CHILD`: Limited access to own account, games, goals, tasks

**Access Control:**
```java
// Backend
@PreAuthorize("hasRole('PARENT')")
public ResponseEntity<?> transferMoney(...) { }

// Frontend
<Route element={<AppLayout requiredRole="PARENT" />}>
  <Route path="/parent/dashboard" element={<ParentDashboard />} />
</Route>
```

---

## 💾 Database Schema

### Entity Relationship Diagram

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│    User     │────────▶│FamilyMember  │◀────────│   Family    │
└─────────────┘         └──────────────┘         └─────────────┘
      │                                                  │
      │                                                  │
      ▼                                                  ▼
┌─────────────┐                                  ┌─────────────┐
│   Account   │                                  │FamilyInvite │
└─────────────┘                                  └─────────────┘
      │
      ├──────────────┬──────────────┬──────────────┐
      ▼              ▼              ▼              ▼
┌─────────────┐┌─────────────┐┌─────────────┐┌─────────────┐
│Transaction  ││    Goal     ││   TaskItem  ││GameSession  │
└─────────────┘└─────────────┘└─────────────┘└─────────────┘
                                                     │
                                                     ▼
                                              ┌─────────────┐
                                              │    Game     │
                                              └─────────────┘
```

### Tables

#### users
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    role VARCHAR(20) NOT NULL,  -- PARENT or CHILD
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### families
```sql
CREATE TABLE families (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### family_members
```sql
CREATE TABLE family_members (
    id BIGSERIAL PRIMARY KEY,
    family_id BIGINT REFERENCES families(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL,  -- PARENT or CHILD
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(family_id, user_id)
);
```

#### family_invites
```sql
CREATE TABLE family_invites (
    id BIGSERIAL PRIMARY KEY,
    family_id BIGINT REFERENCES families(id) ON DELETE CASCADE,
    invite_code VARCHAR(10) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    used BOOLEAN DEFAULT FALSE
);
```

#### accounts
```sql
CREATE TABLE accounts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    balance BIGINT DEFAULT 0,  -- Stored in cents
    account_type VARCHAR(20) NOT NULL,  -- CHECKING, SAVINGS
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### transactions
```sql
CREATE TABLE transactions (
    id BIGSERIAL PRIMARY KEY,
    account_id BIGINT REFERENCES accounts(id) ON DELETE CASCADE,
    amount BIGINT NOT NULL,  -- In cents
    type VARCHAR(30) NOT NULL,  -- DEPOSIT, WITHDRAWAL, TRANSFER, etc.
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### goals
```sql
CREATE TABLE goals (
    id BIGSERIAL PRIMARY KEY,
    account_id BIGINT REFERENCES accounts(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    target_amount BIGINT NOT NULL,  -- In cents
    current_amount BIGINT DEFAULT 0,  -- In cents
    deadline DATE,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### tasks
```sql
CREATE TABLE tasks (
    id BIGSERIAL PRIMARY KEY,
    account_id BIGINT REFERENCES accounts(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    reward_amount BIGINT NOT NULL,  -- In cents
    status VARCHAR(20) NOT NULL,  -- PENDING, COMPLETED, APPROVED
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### games
```sql
CREATE TABLE games (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    coins_per_hundred_points INT DEFAULT 10,
    active BOOLEAN DEFAULT TRUE
);
```

#### game_sessions
```sql
CREATE TABLE game_sessions (
    id BIGSERIAL PRIMARY KEY,
    game_id BIGINT REFERENCES games(id),
    user_id BIGINT REFERENCES users(id),
    score INT NOT NULL,
    coins_earned INT NOT NULL,
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🎮 Game Logic

### Game Types

#### 1. Math Rush
**Objective**: Solve as many math problems as possible in 60 seconds

**Logic**:
```typescript
- Generate random math problems (addition, subtraction, multiplication)
- Difficulty increases with score
- Timer: 60 seconds
- Scoring: +10 points per correct answer, -5 for wrong answer
- Coins: score / 100 * coinsPerHundredPoints
```

#### 2. Memory Cards
**Objective**: Match all pairs of cards

**Logic**:
```typescript
- 16 cards (8 pairs) with financial icons
- Flip two cards at a time
- Match: cards stay revealed
- No match: cards flip back
- Scoring: Based on moves and time
- Coins: (1000 - moves * 10) / 100 * coinsPerHundredPoints
```

#### 3. Smart Quiz
**Objective**: Answer financial literacy questions

**Logic**:
```typescript
- 10 multiple-choice questions
- Topics: saving, budgeting, banking, investing
- Scoring: +100 points per correct answer
- Time bonus: +10 points per second remaining
- Coins: score / 100 * coinsPerHundredPoints
```

#### 4. Word Scramble
**Objective**: Unscramble financial vocabulary words

**Logic**:
```typescript
- 10 scrambled words (bank, save, invest, budget, etc.)
- Time limit: 30 seconds per word
- Scoring: +50 points per word, time bonus
- Hints available (-10 points)
- Coins: score / 100 * coinsPerHundredPoints
```

#### 5. Number Guess
**Objective**: Guess the secret number in 5 rounds

**Logic**:
```typescript
- Secret number between 1-100
- 5 rounds with different ranges
- Feedback: higher/lower
- Scoring: Based on guesses used
- Coins: score / 100 * coinsPerHundredPoints
```

### Game Reward System

```typescript
// Calculate coins earned
const coinsEarned = Math.floor(
  (score / 100) * game.coinsPerHundredPoints
);

// Save game session
POST /api/games/{gameId}/sessions
{
  score: number,
  coinsEarned: number
}

// Update account balance
Account.balance += coinsEarned;
Transaction.create({
  type: 'GAME_REWARD',
  amount: coinsEarned,
  description: `Earned from ${game.title}`
});
```

---

## 💰 Banking Logic

### Money Storage
All monetary values are stored as **integers in cents** to avoid floating-point precision issues.

```java
// Example: $10.50 is stored as 1050 cents
private Long balance; // 1050

// Display formatting
public String getFormattedBalance() {
    return String.format("$%.2f", balance / 100.0);
}
```

### Transaction Types

```java
public enum TransactionType {
    DEPOSIT,           // Parent adds money
    WITHDRAWAL,        // Money removed
    TRANSFER,          // Between accounts
    PARENT_TRANSFER,   // Parent to child
    ALLOWANCE,         // Scheduled allowance
    TASK_REWARD,       // Task completion
    GAME_REWARD,       // Game earnings
    GOAL_CONTRIBUTION  // Savings goal deposit
}
```

### Money Transfer Flow

```
Parent Dashboard
    ↓
Select Child Account
    ↓
Enter Amount
    ↓
Confirm Transfer
    ↓
Backend Validation:
  - Check parent has sufficient balance
  - Validate child account exists
  - Validate amount > 0
    ↓
Execute Transfer:
  1. Deduct from parent account
  2. Add to child account
  3. Create transaction records (2)
  4. Return success
    ↓
Update UI
```

### Account Balance Calculation

```java
// Real-time balance calculation
public Long calculateBalance() {
    return transactionRepository
        .findByAccountId(accountId)
        .stream()
        .mapToLong(Transaction::getAmount)
        .sum();
}
```

---

## 👨‍👩‍👧‍👦 Family Management

### Family Creation Flow

```
1. Parent registers/logs in
2. Parent creates family
   - POST /api/families
   - { name: "Smith Family" }
3. Backend creates:
   - Family record
   - FamilyMember record (parent)
   - FamilyInvite with unique code
4. Parent receives invite code
5. Parent shares code with children
```

### Family Joining Flow

```
1. Child registers/logs in
2. Child enters invite code
   - POST /api/families/join
   - { inviteCode: "ABC123" }
3. Backend validates:
   - Code exists
   - Code not expired
   - Code not used
4. Backend creates:
   - FamilyMember record (child)
   - Links child to family
5. Child can now see family
```

### Invite Code Generation

```java
public String generateInviteCode() {
    String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    StringBuilder code = new StringBuilder();
    Random random = new Random();
    
    for (int i = 0; i < 6; i++) {
        code.append(chars.charAt(random.nextInt(chars.length())));
    }
    
    return code.toString();
}
```

---

## 🔄 API Endpoints

### Authentication
```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login user
GET    /api/auth/me          - Get current user
```

### Banking
```
GET    /api/dashboard        - Get dashboard data
GET    /api/accounts         - List accounts
POST   /api/accounts         - Create account
GET    /api/accounts/{id}    - Get account details
POST   /api/accounts/{id}/transfer - Transfer money

GET    /api/transactions     - List transactions
POST   /api/transactions     - Create transaction

GET    /api/goals            - List goals
POST   /api/goals            - Create goal
PUT    /api/goals/{id}       - Update goal
DELETE /api/goals/{id}       - Delete goal

GET    /api/tasks            - List tasks
POST   /api/tasks            - Create task
PUT    /api/tasks/{id}       - Update task
DELETE /api/tasks/{id}       - Delete task
```

### Family
```
GET    /api/families         - List families
POST   /api/families         - Create family
GET    /api/families/{id}    - Get family details
PUT    /api/families/{id}    - Update family
DELETE /api/families/{id}    - Delete family

POST   /api/families/join    - Join family with code
GET    /api/families/{id}/members - List family members
DELETE /api/families/{id}/members/{userId} - Remove member

GET    /api/families/{id}/invite - Get invite code
POST   /api/families/{id}/invite - Generate new invite
```

### Games
```
GET    /api/games            - List games
GET    /api/games/{id}       - Get game details
POST   /api/games/{id}/sessions - Save game session
GET    /api/games/sessions   - List game sessions
```

---

## 🎨 UI/UX Design Principles

### Mobile-First Design
- Touch targets: minimum 44x44 pixels
- Responsive breakpoints: 640px, 768px, 1024px
- Bottom navigation for easy thumb access
- Large, readable fonts (16px minimum)

### Accessibility
- ARIA labels on interactive elements
- Keyboard navigation support
- High contrast colors
- Screen reader friendly

### Color Scheme
```css
/* Primary Colors */
--primary: 222.2 47.4% 11.2%;
--primary-foreground: 210 40% 98%;

/* Accent Colors */
--accent: 210 40% 96.1%;
--accent-foreground: 222.2 47.4% 11.2%;

/* Status Colors */
--success: 142 76% 36%;
--warning: 38 92% 50%;
--error: 0 84% 60%;
```

### Component Library
- **shadcn/ui**: Pre-built, accessible components
- **Radix UI**: Unstyled, accessible primitives
- **Tailwind CSS**: Utility-first styling
- **Lucide Icons**: Consistent icon set

---

## 🚀 Deployment

### Frontend Deployment Options

#### 1. Desktop (Electron)
```bash
npm run build:electron
# Output: release/win-unpacked/STACK Kids Bank.exe
```

#### 2. Web (Static Hosting)
```bash
npm run build
# Deploy dist/ folder to:
# - Netlify
# - Vercel
# - GitHub Pages
# - AWS S3 + CloudFront
```

#### 3. Android (Capacitor)
```bash
npm run build
npx cap sync android
cd android && ./gradlew assembleDebug
# Output: android/app/build/outputs/apk/debug/app-debug.apk
```

#### 4. iOS (Capacitor)
```bash
npm run build
npx cap sync ios
# Open in Xcode and build
```

### Backend Deployment Options

#### 1. JAR File
```bash
mvn clean package
java -jar target/kidsbank-api-1.0.0.jar
```

#### 2. Docker
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

#### 3. Cloud Platforms
- **Heroku**: `git push heroku main`
- **AWS Elastic Beanstalk**: Deploy JAR
- **Google Cloud Run**: Deploy container
- **Azure App Service**: Deploy JAR

### Database Setup

#### Development (Local PostgreSQL)
```bash
# Install PostgreSQL
# Create database
createdb kidsbank

# Update application.yml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/kidsbank
    username: postgres
    password: your_password
```

#### Production
- **AWS RDS**: Managed PostgreSQL
- **Google Cloud SQL**: Managed PostgreSQL
- **Heroku Postgres**: Add-on
- **Supabase**: PostgreSQL with extras

---

## 🧪 Testing

### Frontend Testing
```bash
# Unit tests
npm run test

# E2E tests (if configured)
npm run test:e2e
```

### Backend Testing
```bash
# Unit tests
mvn test

# Integration tests
mvn verify
```

### Test Coverage Goals
- Unit tests: >80%
- Integration tests: Critical paths
- E2E tests: User flows

---

## 📊 Performance Optimization

### Frontend
- Code splitting with React.lazy()
- Image optimization
- Lazy loading for games
- Memoization with useMemo/useCallback
- Virtual scrolling for long lists

### Backend
- Database indexing on foreign keys
- Query optimization with JPA
- Caching with Spring Cache
- Connection pooling
- Pagination for large datasets

### Database
```sql
-- Indexes for performance
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_transactions_account_id ON transactions(account_id);
CREATE INDEX idx_family_members_family_id ON family_members(family_id);
CREATE INDEX idx_family_members_user_id ON family_members(user_id);
```

---

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)
```bash
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=STACK Kids Bank
```

#### Backend (application.yml)
```yaml
server:
  port: 8080

spring:
  datasource:
    url: ${DATABASE_URL:jdbc:postgresql://localhost:5432/kidsbank}
    username: ${DATABASE_USERNAME:postgres}
    password: ${DATABASE_PASSWORD:password}
  
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false

jwt:
  secret: ${JWT_SECRET:your-secret-key-change-in-production}
  expiration: 86400000  # 24 hours
```

---

## 🐛 Troubleshooting

### Common Issues

#### Frontend
**Issue**: Games not loading
**Solution**: Check FALLBACK_GAMES in Games.tsx

**Issue**: API calls failing
**Solution**: Verify VITE_API_URL and backend is running

**Issue**: Authentication errors
**Solution**: Clear localStorage and re-login

#### Backend
**Issue**: Database connection failed
**Solution**: Check PostgreSQL is running and credentials

**Issue**: JWT token invalid
**Solution**: Check JWT_SECRET matches between requests

**Issue**: CORS errors
**Solution**: Verify CorsConfig allows frontend origin

---

## 📈 Future Enhancements

### Planned Features
1. **Recurring Allowances**: Automatic scheduled transfers
2. **Chore Tracking**: Photo verification for tasks
3. **Spending Categories**: Budget tracking by category
4. **Notifications**: Push notifications for transactions
5. **Reports**: Monthly spending reports
6. **Multi-Currency**: Support for different currencies
7. **Parental Controls**: Spending limits and approvals
8. **Educational Content**: Financial literacy lessons
9. **Achievements**: Badges and rewards system
10. **Social Features**: Share goals with friends

---

## 📝 License

This project is proprietary software. All rights reserved.

---

## 👥 Team & Contact

**Project**: STACK Kids Bank
**Version**: 1.0.0
**Last Updated**: March 2026

For support or questions, please contact the development team.

---

## 🎓 Learning Resources

### For Developers
- [React Documentation](https://react.dev)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Capacitor Documentation](https://capacitorjs.com/docs)

### For Users
- See USER_GUIDE.md for end-user documentation
- See SETUP_INSTRUCTIONS.md for installation guide

---

**End of Documentation**
