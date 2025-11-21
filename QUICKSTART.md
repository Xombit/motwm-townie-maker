# 🚀 Quick Start Guide

## First Time Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Deploy to Foundry:**
   ```bash
   npm run deploy
   ```

3. **Launch Foundry VTT**
   - Enable "MOTWM Townie Maker" in Module Settings
   - Open Actor Directory
   - Click the "Townie Maker" button (🧑‍🤝‍🧑 icon)

## Development Commands

| Command | What it does |
|---------|-------------|
| `npm run build` | Build once |
| `npm run watch` | Auto-rebuild on source changes |
| `npm run deploy` | Build + copy to Foundry |
| `npm run dev:foundry` | Watch + auto-deploy (recommended!) |

## Recommended Workflow

### Option 1: Quick Test
```bash
npm run deploy
```
Then restart Foundry.

### Option 2: Active Development (Best!)
**Terminal 1:**
```bash
npm run watch
```

**Terminal 2:**
```bash
npm run dev:foundry
```

Now you get:
- Edit TypeScript/CSS → Auto-builds
- Changes to built files → Auto-deploys to Foundry
- Just hit F5 in Foundry to see changes!

## Project Structure

```
src/
  ├── main.ts              - Entry point
  ├── ui/
  │   └── TownieMakerApp.ts - Main UI
  ├── data/
  │   └── templates.ts      - NPC templates (⭐ customize here!)
  ├── d35e-adapter.ts       - D35E integration (⚠️ needs work!)
  └── settings.ts           - Module settings

templates/
  └── townie-maker.hbs      - UI template

dist/                       - Built files (auto-generated)
```

## Key Files to Edit

1. **Add NPC Templates:** `src/data/templates.ts`
2. **Implement D35E:** `src/d35e-adapter.ts`
3. **Modify UI:** `src/ui/TownieMakerApp.ts`
4. **Style Changes:** `src/styles/styles.css`

## Common Tasks

### Add a new NPC template
Edit `src/data/templates.ts`, add entry like:
```typescript
{
  id: "blacksmith",
  name: "Blacksmith",
  description: "Village craftsman",
  icon: "fas fa-hammer",
  race: "Dwarf",
  classes: [{ name: "Expert", level: 4 }],
  abilities: { str: 16, dex: 10, con: 14, int: 12, wis: 12, cha: 8 }
}
```

### Test in Foundry
1. Make your changes
2. Wait for build (if `npm run watch` is running)
3. Hit F5 in Foundry
4. Test the changes

### Package for release
```powershell
.\scripts\pack.ps1
```
Creates `motwm-townie-maker-0.1.0.zip`

## Troubleshooting

**Module not appearing in Foundry?**
- Check: `C:\Users\User\AppData\Local\FoundryVTT\Data\modules\motwm-townie-maker`
- Verify `module.json` exists
- Restart Foundry completely

**Build errors?**
- TypeScript warnings are normal (Foundry types not complete)
- Check console for actual errors

**Changes not showing?**
- Make sure `npm run watch` is running
- Hard refresh in Foundry (Ctrl+Shift+R)
- Check browser console for errors

## Next Steps

1. ✅ Module is deployed and ready to test
2. 🔧 Implement D35E adapter functions in `src/d35e-adapter.ts`
3. 🎨 Customize templates in `src/data/templates.ts`
4. 🧪 Test creating NPCs in Foundry
5. 🚀 Iterate and improve!

## Resources

- [DEVELOPMENT.md](DEVELOPMENT.md) - Detailed dev guide
- [scripts/README.md](scripts/README.md) - Script documentation
- [NEXT_STEPS.md](NEXT_STEPS.md) - Implementation guide
- Your XP Calculator (`e:\src\motwm-xp\`) - Reference implementation

---

**Ready to develop!** 🎉
