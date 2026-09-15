# Changelog

## [Unreleased]

### Changed
- **Foundry compatibility hardening**: Continued the v11/v14 compatibility pass with native DOM usage, compatibility helpers, and safer document/index access patterns.
- **Biography and notes routing**: Biography and personality text now route to the correct D35E sheet tabs and are applied after the rest trigger so they are not overwritten.
- **Creation flow hardening**: Spell gating, form parsing, compendium lookup normalization, and pipeline planning were centralized to reduce branch-specific drift.
- **NPC caster routing hardening**: Spell-class normalization now handles NPC-suffixed labels (for example, `Adept (NPC)`), and Adept is treated as an eligible caster path in spell gating/selection.
- **Exclusive wealth mode**: Budget settings now use a single canonical mode so standard budget, NPC gear value, and no-budget choices cannot be selected together; the create path derives the legacy flags from that mode.
- **Spell import warning fix**: Imported spells now use D35E's `ignoreSpellbookAndLevel` path so class-list validation does not spam the "Spell added despite not being in a spell list for class" warning.
- **SRD loot profile wiring**: `lootProfile` now drives TreasureGenerator multipliers through the profile system instead of always using standard 1x/1x/1x generation.
- **Audit harness expansion**: Added scenario traces, scenario evaluation/reporting helpers, subsystem triage output, and a richer audit pipeline that emits machine-readable artifacts.
- **Runtime-faithful scenario data**: The scenario artifact generator now records branch-level trace data for HP, spells, equipment/budget, biography routing, ranger/rogue special-feature paths, and NPC caster branches.
- **Test coverage**: Added audit, unit, and integration coverage around the new trace model, biography routing, spell gating, compendium normalization, NPC equipment branches, exclusive budget mode, spell import options, SRD loot profile behavior, and the audit pipeline script.
- **CI and tooling**: Added a CI workflow for test/build/audit checks, switched the scenario generator to `tsx`, and kept the deploy script aligned with the Foundry v14 support work.

## [0.3.0] - 2026-04-10

### Changed
- **Foundry v14 dual compatibility**: Module now supports Foundry v11 through v14 simultaneously.
  - Replaced `mergeObject` global with `foundry.utils.mergeObject` throughout.
  - Migrated all jQuery DOM manipulation in `TownieMakerApp` to native DOM APIs.
  - Replaced `_id` compendium index reads with `id ?? _id` fallback pattern for v14 document index compatibility.
  - Actor Directory button injection rewritten with native `createElement`/`appendChild` and a duplicate-insertion guard.
  - New `src/foundry-compat.ts` compatibility layer centralizes all cross-version API abstractions.
- Module manifest updated: `compatibility.minimum = "11"`, `compatibility.verified = "14"`.

## [0.2.0] - 2026-04-09

### Bug Fixes
- **Gnome token art**: Fixed gnome race variants ("gnome, rock" / "gnome, forest") not mapping to artwork folders, resulting in missing portraits and tokens.
- **Weapon attacks empty**: Added `carried: true` flag to all weapon, armor, and shield creation paths. The D35E attack generator filters by `carried === true`, so mundane equipment created without it produced no attack entries.
- **Biography not transferring**: Moved biography write to after the D35E rest trigger so it cannot be overwritten by post-creation hooks.
- **Weapon Specialization at wrong level**: Added feat prerequisite checking to `allocateFeats()`. Feats with class-level requirements (Weapon Specialization, Greater Weapon Focus, etc.) are now deferred to an appropriate slot instead of being assigned sequentially.
- **Skill allocation over-spending**: Rewrote the skill distribution loop to be budget-constrained. Points are now allocated in priority order (high > medium > low) up to the available skill points per level; no more exceeding the budget at levels where medium/low skills activate.

### Added
- **D35E system styling**: Window now inherits D35E's parchment theme. Removed the standalone dark theme from `styles.css`, keeping only layout-specific rules.
- **NPC wealth table (DMG Table 4-23)**: New "Use NPC Gear Value" checkbox in Config tab. Auto-enabled for NPC classes. Uses the lower NPC gear value table instead of PC wealth-by-level.
- **SRD loot packs**: New "Include SRD Loot Pack" checkbox (off by default) in Config tab. Generates random SRD treasure (coins, gems, magic items) appropriate to the NPC's CR using D35E's built-in `TreasureGenerator`.

### Changed
- Deploy script (`scripts/deploy.ps1`) now resolves Node 20 from nvm-windows and prefers the `foundry-v11` data directory.

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
