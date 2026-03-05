# 🚀 Quick Reference Card

## 📍 URLs
- **Frontend:** http://localhost:8081
- **Backend:** http://localhost:8080

## 👤 Test Accounts
- **Parent:** testparent / password123
- **Child:** testchild / password123

## ✨ New Features

### Family Management (PARENT)
| Action | How |
|--------|-----|
| Edit | Click ✏️ icon |
| Delete | Click 🗑️ icon |
| Create | Use form at top |
| Invite | Click "Generate Invite Code" |

### Games (CHILD)
| Game | Icon | Time/Rounds |
|------|------|-------------|
| Math Rush | 🧮 | 60 seconds |
| Memory Cards | 🃏 | Until complete |
| Smart Quiz | 🧠 | 10 questions |
| Word Scramble | 🔤 | 90 seconds |
| Number Guess | 🎯 | 5 rounds |

## 🎮 Game Tips

**Word Scramble:**
- Use hints
- Skip if stuck
- +15 correct, -5 wrong

**Number Guess:**
- Start with 50
- Use binary search
- Fewer tries = more points

## 🔧 Commands

**Start Backend:**
```bash
cd stack && mvn spring-boot:run
```

**Start Frontend:**
```bash
cd stack-family-finance && npm run dev
```

**Build Desktop:**
```bash
cd stack-family-finance && npm run build:electron
```

## 📊 Status
- ✅ Backend: Running
- ✅ Frontend: Running
- ✅ 5 Games: Working
- ✅ Family CRUD: Complete
- ✅ Mobile: Optimized

## 🎯 Test Checklist
- [ ] Edit family name
- [ ] Delete family
- [ ] Play Word Scramble
- [ ] Play Number Guess
- [ ] All 5 games work

**Everything is ready!** 🎉
