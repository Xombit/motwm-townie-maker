# Changelog

## [0.1.0] - 2026-01-22

Initial public beta release.

### Added
- Townie Maker actor creation UI (template gallery + guided workflow)
- Runtime template system via `data/templates.json` (no rebuild needed to tweak templates)
- Support for levels 1–20 across PC and NPC classes (D35E)
- Ability score workflows (template defaults + standard array / rolled stats)
- D35E integration for applying:
	- race and class items
	- skills (PC sheet path via level-up data; simple NPC sheet path via direct assignment)
	- feats, including configured feats (Spell Focus / Weapon Focus / Skill Focus selections)
	- spells for caster classes
- Equipment + wealth system:
	- wealth-by-level budgeting
	- mundane gear + level-scaled magic items and enhancements
	- consumables (scrolls, wands, potions) by role
	- optional item identification behavior
	- coin generation and “bank deposit slip” handling for excess wealth
- Quality-of-life generation:
	- random names
	- portrait/token assignment from bundled artwork
	- token disposition defaults

### Beta Status / Known Limitations
- Output depends on the installed D35E compendiums and system version; if entries differ, some items/spells/features may not be found.
- Templates are edited by modifying `data/templates.json`; there is no in-Foundry template editor yet.
- Some edge-case rules automation is still being refined (especially for complex caster and class feature interactions).
- Inventory organization performs a post-create “organize/move into containers” pass; other modules that modify items during creation may affect container moves.
