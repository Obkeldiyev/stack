# Database Schema Fix

## 🔍 Problem
The `users` table is missing the `enabled` column that exists in your Java entity.

## 🛠️ Solution 1: Add Missing Column (Recommended)

### Connect to PostgreSQL on Server
```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Connect to your database
\c kidsbank
```

### Add the Missing Column
```sql
-- Add the enabled column with default value true
ALTER TABLE users ADD COLUMN enabled BOOLEAN NOT NULL DEFAULT true;

-- Verify the column was added
\d users

-- Exit PostgreSQL
\q
```

### Verify Fix
```bash
# Restart your application
pm2 restart stack

# Check logs
pm2 logs stack
```

## 🛠️ Solution 2: Let Hibernate Auto-Update Schema

### Update application.properties
Add this to your `stack/src/main/resources/application.properties`:

```properties
# Allow Hibernate to update database schema
spring.jpa.hibernate.ddl-auto=update
```

### Restart Application
```bash
pm2 restart stack
```

## 🛠️ Solution 3: Reset Database (Nuclear Option)

⚠️ **WARNING: This will delete all data!**

```sql
-- Connect to PostgreSQL
sudo -u postgres psql

-- Drop and recreate database
DROP DATABASE kidsbank;
CREATE DATABASE kidsbank;
GRANT ALL PRIVILEGES ON DATABASE kidsbank TO kidsbank_user;

-- Exit
\q
```

Then restart your application - Hibernate will create all tables fresh.

## ✅ Verification

After applying any solution, test with:

```bash
# Check application logs
pm2 logs stack

# Test API endpoint
curl http://localhost:8080/

# Test login endpoint
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'
```

## 🔧 Prevention

To avoid this in the future, use database migrations or ensure your server database schema matches your entity definitions.

### Recommended application.properties for production:
```properties
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
```

This allows Hibernate to automatically add new columns when you add fields to entities.