# 🔧 Fix 500 Server Error

## Problem:
Getting 500 errors with message: "Name for argument of type [java.lang.Long] not specified, and parameter name information not available via reflection. Ensure that the compiler uses the '-parameters' flag."

## Solution:

### ✅ I Fixed the Backend Configuration

I added `<parameters>true</parameters>` to the Maven compiler plugin in `pom.xml`.

### 🔄 You Need to Rebuild the Backend

**Stop the backend (Ctrl+C) and run:**

```bash
cd stack
mvn clean install
mvn spring-boot:run
```

This will:
1. Clean old compiled files
2. Recompile with `-parameters` flag
3. Start the backend with the fix

---

## What This Fixes:

The `-parameters` flag tells Java to preserve parameter names in compiled code. Spring needs this to:
- Map `@PathVariable Long familyId` correctly
- Map `@RequestBody` parameters
- Handle method parameters in controllers

Without it, Spring can't figure out which parameter is which → 500 error!

---

## After Rebuilding:

All these endpoints will work:
- ✅ `/api/family/{familyId}/invite` - Generate invite code
- ✅ `/api/family/{familyId}/members` - View family members
- ✅ All other endpoints with path variables

---

## Quick Steps:

1. **Stop backend** (Ctrl+C in the terminal running it)
2. **Rebuild:**
   ```bash
   cd stack
   mvn clean install
   ```
3. **Start backend:**
   ```bash
   mvn spring-boot:run
   ```
4. **Test again** - Should work now!

---

## What I Changed:

**File:** `stack/pom.xml`

**Added:**
```xml
<parameters>true</parameters>
```

**In the maven-compiler-plugin configuration.**

This ensures Java preserves parameter names during compilation.

---

## Summary:

✅ Backend configuration fixed
⏳ You need to rebuild: `mvn clean install && mvn spring-boot:run`
✅ Then all endpoints will work!
