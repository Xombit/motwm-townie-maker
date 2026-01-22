# MOTWM Townie Maker - Development Guide

This document is for contributors working on the module source.

- For the current beta status + roadmap, see `STATUS_AND_ROADMAP.md`.
- For user-facing usage docs, see the project root `README.md`.

## Project Structure

```
motwm-townie-maker/
├── data/                         # Runtime data files (shipped with module)
│   └── templates.json            # Templates loaded at runtime
├── src/                          # Source TypeScript files
│   ├── main.ts                   # Entry point, hooks registration
│   ├── settings.ts               # Module settings
│   ├── types.d.ts               # TypeScript type definitions
│   ├── d35e-adapter.ts          # D35E system integration helpers
│   ├── data/
│   │   └── template-loader.ts   # Loads templates.json at runtime
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
npm run pack-win
```

This creates a stable (unversioned) release zip at `packages/motwm-townie-maker.zip`.

## Templates

Templates are loaded at runtime from `data/templates.json` (see `src/data/template-loader.ts`).
This means template edits do not require rebuilding the module, but the JSON must be valid.

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

### Adding Classes / HP / Skills / Feats
Implementation lives in `src/d35e-adapter.ts` and is designed to work with Rughalt's D35E system.
If you’re changing system integration behavior, make sure to validate in Foundry with real compendium data.

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
Foundry and system types can be incomplete. If you see type issues, prefer fixing the typing locally where safe, but don’t block builds on non-critical type gaps.

### Module Not Loading
1. Check `module.json` paths are correct
2. Ensure `dist/` folder exists after building
3. Verify module is enabled in Foundry

### D35E Integration
If creation succeeds but some data isn't applied, check the browser console for `D35EAdapter | ...` logs and confirm the relevant compendium entries exist in your D35E install.
