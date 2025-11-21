# MOTWM Townie Maker

**Quick NPC and Adversary creation tool for Foundry VTT D35E**

Create D&D 3.5e NPCs and adversaries using PC character sheets with a streamlined, guided workflow. Perfect for GMs who need to quickly populate their world with interesting characters.

## Features

- 🎭 **Quick NPC Creation** - Create NPCs using PC character sheets with guided workflow
- ⚔️ **Adversary Builder** - Build combat-ready adversaries with proper stats
- 📊 **Template System** - Start from common archetypes (Guard, Merchant, Wizard, etc.)
- 🎲 **D35E Integration** - Full integration with D35E system mechanics
- 🔄 **Batch Creation** - Create multiple similar NPCs at once
- 💾 **Save Templates** - Save your custom NPC templates for reuse

## Installation

1. In Foundry VTT, go to **Add-on Modules**
2. Click **Install Module**
3. Search for "MOTWM Townie Maker" or paste the manifest URL
4. Click **Install**

## Usage

1. Click the **Townie Maker** button in the Actor Directory toolbar
2. Choose a template or start from scratch
3. Fill in the guided form with NPC details
4. Click **Create NPC** to generate your character

## Development

### Quick Deploy to Foundry
```bash
npm install
npm run deploy
```

This builds and copies the module to your Foundry modules directory.

### Active Development
Run these in separate terminals for live updates:

```bash
npm run watch          # Terminal 1: Rebuilds on code changes
npm run dev:foundry    # Terminal 2: Auto-deploys to Foundry
```

### Build & Package
```bash
npm run build          # Build once
npm run deploy         # Deploy to Foundry
.\scripts\pack.ps1     # Create distribution .zip
```

For more details, see [DEVELOPMENT.md](DEVELOPMENT.md).

## License

MIT License - See LICENSE file for details
