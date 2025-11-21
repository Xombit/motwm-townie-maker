# MOTWM Townie Maker - Development Guide

## Project Structure

```
motwm-townie-maker/
├── src/                          # Source TypeScript files
│   ├── main.ts                   # Entry point, hooks registration
│   ├── settings.ts               # Module settings
│   ├── types.d.ts               # TypeScript type definitions
│   ├── d35e-adapter.ts          # D35E system integration helpers
│   ├── data/
│   │   └── templates.ts         # NPC template definitions
│   ├── ui/
│   │   └── TownieMakerApp.ts   # Main application window
│   └── styles/
│       └── styles.css           # Module styles
├── templates/                    # Handlebars templates
│   └── townie-maker.hbs        # Main UI template
├── lang/                        # Localization
│   └── en.json                 # English translations
├── scripts/                     # Build scripts
│   └── pack.ps1                # Distribution packaging script
├── dist/                        # Built output (generated)
├── module.json                  # Foundry module manifest
├── package.json                 # npm dependencies
├── tsconfig.json               # TypeScript config
└── vite.config.ts              # Vite build config
```

## Development Workflow

### Initial Setup
```bash
npm install
```

### Quick Deploy to Foundry
```bash
npm run deploy    # Build and copy to Foundry modules folder
```

### Active Development (Recommended)
**Terminal 1 - Watch TypeScript/CSS:**
```bash
npm run watch    # Rebuilds on src/ changes
```

**Terminal 2 - Auto-deploy to Foundry:**
```bash
npm run dev:foundry    # Watches and copies to Foundry on changes
```

This gives you live updates: edit source → auto-build → auto-deploy → reload in Foundry

### Build for Production
```bash
npm run build    # One-time build
```

### Package for Distribution
```powershell
.\scripts\pack.ps1    # Creates versioned .zip file
```

## Key Features to Develop

### Phase 1 (Current)
- [x] Basic project structure
- [x] Template system with 10 archetypes
- [x] Guided UI with tabs
- [x] Ability score generation
- [ ] Complete D35E integration
- [ ] Class/level assignment
- [ ] HP rolling

### Phase 2 (Future)
- [ ] Batch creation (create multiple NPCs at once)
- [ ] Custom template saving
- [ ] Equipment assignment from templates
- [ ] Skill rank distribution
- [ ] Feat selection
- [ ] Spell selection for casters

### Phase 3 (Advanced)
- [ ] Import from SRD/compendiums
- [ ] Random name generation
- [ ] Portrait integration
- [ ] Token configuration
- [ ] Export/import custom templates

## Borrowing from motwm-xp

You can reference the XP calculator for:
- **D35E Adapter patterns**: `../motwm-xp/src/d35e-adapter.ts`
- **Settings registration**: `../motwm-xp/src/settings.ts`
- **UI styling patterns**: `../motwm-xp/src/styles/styles.css`
- **Build configuration**: `../motwm-xp/vite.config.ts`
- **Packaging scripts**: `../motwm-xp/scripts/pack.ps1`

## D35E System Integration Notes

### Actor Creation
```typescript
const actor = await Actor.create({
  name: "NPC Name",
  type: "character",  // or "npc"
  folder: folderId
});
```

### Setting Ability Scores
```typescript
await actor.update({
  "system.abilities.str.value": 14,
  "system.abilities.dex.value": 12,
  // ... etc
});
```

### Adding Classes
The D35E system stores classes in `system.classes`. You'll need to:
1. Find the class item from a compendium
2. Create an embedded item on the actor
3. Set the level appropriately

### Rolling HP
Use D35E's built-in HP rolling mechanisms after classes are assigned.

## Testing Checklist

- [ ] Module loads without errors
- [ ] Townie Maker button appears in Actor Directory
- [ ] Templates display correctly
- [ ] Form tabs navigate properly
- [ ] Ability score buttons work
- [ ] NPC creation succeeds
- [ ] Folder organization works
- [ ] Settings persist correctly

## Common Issues

### TypeScript Errors
The project has some intentional TypeScript errors due to missing Foundry type definitions. These are normal during development. The module will still build and work in Foundry.

### Module Not Loading
1. Check `module.json` paths are correct
2. Ensure `dist/` folder exists after building
3. Verify module is enabled in Foundry

### D35E Integration
The adapter functions are stubs - you'll need to implement them based on the actual D35E system structure.
