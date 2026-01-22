# Feat Selection System

## Overview
The feat selection system handles the complex feat progression for D&D 3.5e characters, including:
- Standard feat progression (every character)
- Bonus human feat (1st level)
- Class bonus feats (Fighter, Wizard, Monk)
- Ranger combat style feats (automatic)
- Ranger favored enemies

Rogue special abilities are handled separately (see “Rogue Special Abilities” below).

## Standard Feat Progression
All characters gain feats at: **1st, 3rd, 6th, 9th, 12th, 15th, 18th**

Humans gain an **additional feat at 1st level**.

## Class Bonus Feats

### Fighter
Fighters gain bonus feats at: **1st, 2nd, 4th, 6th, 8th, 10th, 12th, 14th, 16th, 18th, 20th**

Must be chosen from the Fighter bonus feat list:
- Ranged combat feats (Point Blank Shot, Precise Shot, Rapid Shot, Manyshot, etc.)
- Melee combat feats (Power Attack, Cleave, Great Cleave, etc.)
- Two-weapon fighting feats
- Mounted combat feats
- Weapon specialization feats (Focus, Specialization, Greater Focus, Greater Specialization, Improved Critical)
- Combat maneuver feats (Improved Disarm, Improved Sunder, Improved Trip, etc.)

### Wizard
Wizards gain bonus feats at: **5th, 10th, 15th, 20th**

Must be chosen from:
- **Metamagic feats**: Empower Spell, Enlarge Spell, Extend Spell, Heighten Spell, Maximize Spell, Quicken Spell, Silent Spell, Still Spell, Widen Spell
- **Item creation feats**: Brew Potion, Craft Magic Arms and Armor, Craft Rod, Craft Staff, Craft Wand, Craft Wondrous Item, Forge Ring, Scribe Scroll
- **Spell-focused feats**: Spell Focus, Greater Spell Focus, Spell Penetration, Greater Spell Penetration

### Monk
Monks gain bonus feats at: **1st, 2nd, 6th**

Must be chosen from:
- Improved Grapple
- Stunning Fist (automatically granted at 1st level)
- Combat Reflexes
- Deflect Arrows
- Improved Disarm
- Improved Trip

### Rogue
Rogues gain **special abilities** at: **10th, 13th, 16th, 19th**

Can choose from:
- **Defensive**: Defensive Roll, Improved Evasion, Opportunist, Slippery Mind
- **Offensive**: Crippling Strike
- **Skill-based**: Skill Mastery
- **Any feat** they qualify for

In this module, Rogue special abilities are configured via `rogueSpecialAbilities` in `data/templates.json` and applied separately during actor creation.

## Ranger Special Features

### Combat Style (Automatic Bonus Feats)
Rangers choose a combat style at 2nd level, gaining bonus feats automatically (no prerequisites required):

**Archery Style** (gains at 2nd, 6th, 11th):
- 2nd: Rapid Shot
- 6th: Manyshot  
- 11th: Improved Precise Shot

**Two-Weapon Fighting Style** (gains at 2nd, 6th, 11th):
- 2nd: Two-Weapon Fighting
- 6th: Improved Two-Weapon Fighting
- 11th: Greater Two-Weapon Fighting

Combat style is determined by the template’s explicit setting:
- `rangerCombatStyle: "archery"` or `"two-weapon"`

If `rangerCombatStyle` is not set, the module will not add combat style feats (even if the template’s weapons imply one).

### Favored Enemies
Rangers gain favored enemies at: **1st, 5th, 10th, 15th, 20th**

Each grants +2 bonus to:
- Bluff, Listen, Sense Motive, Spot, Survival checks
- Weapon damage rolls

## Implementation

### Template Configuration

**Ranger Template Example (data/templates.json):**
```json
{
  "id": "ranger-scout",
  "name": "Ranger Scout",
  "race": "Elf, High",
  "classes": [{ "name": "Ranger", "level": 1 }],
  "rangerCombatStyle": "archery",
  "favoredEnemies": ["Humanoid (Orc)", "Giant", "Magical Beast", "Dragon"],
  "feats": [
    "Track",
    "Point Blank Shot",
    "Precise Shot",
    "Endurance",
    {
      "name": "Weapon Focus (No Weapon Selected)",
      "displayName": "Weapon Focus (Longbow)",
      "config": { "weaponGroup": "Longbow" }
    }
  ],
  "startingKit": {
    "weapons": [
      { "name": "Longbow", "type": "weapon" },
      { "name": "Longsword", "type": "weapon" }
    ]
  }
}
```

### Feat Allocation Algorithm

The `allocateFeats()` function in `feat-selection.ts`:

1. **Add Ranger combat style feats** (if Ranger)
   - 2nd, 6th, 11th levels
   - Automatic, no prerequisites

2. **Add class bonus feats** (Fighter/Wizard/Monk)
   - Take feats from template list
   - Mark as used

3. **Add standard feats** (including human bonus)
   - Take remaining feats from template list
   - Skip already-used feats

4. **Sort by level** and return allocations

### Template Feat Ordering

When listing feats in templates:
1. List all feats in the order they should be gained
2. System automatically allocates to appropriate slots
3. No need to track which are "bonus" vs "standard"

**Example for Level 12 Fighter (ordering only):**
```json
{
  "feats": [
    "Power Attack",
    "Cleave",
    {
      "name": "Weapon Focus (No Weapon Selected)",
      "displayName": "Weapon Focus (Longsword)",
      "config": { "weaponGroup": "Longsword" }
    },
    {
      "name": "Weapon Specialization (No Weapon Selected)",
      "displayName": "Weapon Specialization (Longsword)",
      "config": { "weaponGroup": "Longsword" }
    },
    "Improved Sunder",
    {
      "name": "Improved Critical (No Weapon Selected)",
      "displayName": "Improved Critical (Longsword)",
      "config": { "weaponGroup": "Longsword" }
    },
    {
      "name": "Greater Weapon Focus (No Weapon Selected)",
      "displayName": "Greater Weapon Focus (Longsword)",
      "config": { "weaponGroup": "Longsword" }
    }
  ]
}
```

System determines:
- 1st level: Power Attack (Fighter bonus), Cleave (Standard)
- 2nd level: Weapon Focus (Fighter bonus)  
- 3rd level: Weapon Specialization (Standard)
- 4th level: Improved Sunder (Fighter bonus)
- 6th level: Improved Critical (Standard), Greater Weapon Focus (Fighter bonus)

Note: the module does not validate prerequisites; template authors are responsible for only listing legal picks.

## Rogue Special Abilities

Rogue special abilities are configured separately from feats using `rogueSpecialAbilities` in `data/templates.json`.

During actor creation, these are applied via `D35EAdapter.addRogueSpecialAbilities(...)`.

## Validation

The system does NOT validate:
- Feat prerequisites (assumes template creator knows the rules)
- Ability score requirements
- BAB requirements
- Whether bonus feats are from correct list

Templates should be carefully designed by someone familiar with D&D 3.5e rules.

## Possible Enhancements

1. **Feat prerequisite validation** - Check if character meets requirements
2. **Automatic prerequisite suggestions** - If selecting Manyshot, suggest Point Blank Shot
3. **Combat style fallback** - If `rangerCombatStyle` is missing, infer it from weapons
4. **Combat style switching** - Support alternate rule for switching styles

## Files

- `src/data/feat-selection.ts` - Core feat allocation logic
- `src/ui/TownieMakerApp.ts` - Integration with character creation
- `src/d35e-adapter.ts` - Feat compendium lookup and application
- `src/types.d.ts` - Type definitions (FeatConfig, TownieTemplate)
- `data/templates.json` - Runtime template definitions (including feats)
