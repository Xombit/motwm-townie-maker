# Status & Roadmap (Beta)

This is the single “source of truth” for what the project currently supports and what’s planned next.

## Current Status

### What’s working (beta scope)
- Townie Maker app in Foundry creates a D35E actor from a template.
- Templates are loaded at runtime from `data/templates.json` (no rebuild required to change templates).
- Character creation pipeline supports (varies by template):
  - Race + class assignment
  - Ability scores
  - Skill allocation
  - Feat selection (including configurable feats like Spell Focus / Weapon Focus / Skill Focus)
  - Equipment, weapon/armor enhancements, and basic inventory organization
  - Post-create rest to initialize daily-use resources

### Known beta constraints (intentionally not “perfect PC sheet automation”)
- Some class features require user choices on the sheet (domains, schools, etc.).
- Caster loadouts/spell lists may not be exhaustive for every class/archetype.
- Templates are validated and best-effort; invalid templates fall back to a minimal blank template.

## Roadmap

### High priority
- Expand/verify template coverage (skills/feats/equipment) and add more “common NPC roles”.
- Improve error surfacing (clear UI messages when a compendium entry can’t be found).
- Continue tuning budgets and magic item selections based on real in-Foundry results.

### Medium priority
- More robust spell loadouts per class/archetype.
- More container organization rules (e.g., ammo, consumables, tools).
- More token/portrait automation and better image resolver options.

### Lower priority
- Batch creation.
- Template import/export UI.
- Optional prerequisite validation for feats.

## Where the old notes went

- Deep research notes and dumps are in `docs/archive/`.
- Older plans and scaffolding-era docs are in `docs/delete/` for manual review/deletion.
