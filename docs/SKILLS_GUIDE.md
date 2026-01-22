# Skills Configuration Guide

This guide explains how to configure skills for character templates in MOTWM Townie Maker.

Skill configuration is authored in `data/templates.json` (runtime templates).

## Skill Points by Class

### Level 1 Skill Points Formula
At 1st level: **(Base Skill Points + Int Modifier) × 4**

Each additional level: **Base Skill Points + Int Modifier**

### Base Skill Points by Class

| Class | Base Skill Points | With Int 10 (Level 1) | With Int 18 (Level 1) |
|-------|------------------|----------------------|----------------------|
| **PC Classes** |
| Rogue | 8 | 32 | 48 |
| Bard | 6 | 24 | 40 |
| Ranger | 6 | 24 | 40 |
| Monk | 4 | 16 | 32 |
| Barbarian | 4 | 16 | 32 |
| Druid | 4 | 16 | 32 |
| Fighter | 2 | 8 | 24 |
| Cleric | 2 | 8 | 24 |
| Paladin | 2 | 8 | 24 |
| Sorcerer | 2 | 8 | 24 |
| Wizard | 2 | 8 | 24 |
| **NPC Classes** |
| Expert | 6 | 24 | 40 |
| Adept | 2 | 8 | 24 |
| Aristocrat | 4 | 16 | 32 |
| Commoner | 2 | 8 | 24 |
| Warrior | 2 | 8 | 24 |

## Skill IDs Reference

### Social Skills
- **apr** - Appraise (Int) - For merchants, appraisers
- **blf** - Bluff (Cha) - For con artists, rogues
- **dip** - Diplomacy (Cha) - For nobles, diplomats, merchants
- **gif** - Gather Information (Cha) - For spies, tavernkeepers
- **int** - Intimidate (Cha) - For guards, warriors
- **sen** - Sense Motive (Wis) - For anyone dealing with people

### Stealth Skills
- **hid** - Hide (Dex) - For rogues, assassins
- **mos** - Move Silently (Dex) - For rogues, scouts
- **dis** - Disguise (Cha) - For spies, con artists
- **fog** - Forgery (Int) - For forgers, spies

### Physical Skills
- **clm** - Climb (Str)
- **jmp** - Jump (Str)
- **swm** - Swim (Str)
- **rid** - Ride (Dex) - For cavaliers, scouts
- **blc** - Balance (Dex)
- **tmb** - Tumble (Dex) - For acrobats, monks
- **esc** - Escape Artist (Dex) - For rogues

### Knowledge Skills (Int)
- **kar** - Knowledge (Arcana) - For wizards, sorcerers
- **kdu** - Knowledge (Dungeoneering) - For rangers, rogues
- **ken** - Knowledge (Engineering) - For siege engineers
- **kge** - Knowledge (Geography) - For explorers, sailors
- **khi** - Knowledge (History) - For sages, bards
- **klo** - Knowledge (Local) - For natives, merchants
- **kna** - Knowledge (Nature) - For druids, rangers
- **kno** - Knowledge (Nobility) - For nobles, heralds
- **kpl** - Knowledge (Planes) - For planar travelers
- **kre** - Knowledge (Religion) - For clerics, paladins

### Perception Skills
- **lis** - Listen (Wis)
- **spt** - Spot (Wis)
- **src** - Search (Int) - For finding traps, hidden objects

### Spellcasting Skills
- **coc** - Concentration (Con) - Essential for all spellcasters
- **spl** - Spellcraft (Int) - For wizards, identifying magic
- **umd** - Use Magic Device (Cha) - For rogues, bards

### Survival Skills
- **sur** - Survival (Wis) - For rangers, druids, barbarians
- **hea** - Heal (Wis) - For clerics, healers
- **han** - Handle Animal (Cha) - For rangers, druids, farmers

### Rogue Skills
- **opl** - Open Lock (Dex)
- **dev** - Disable Device (Int)
- **slt** - Sleight of Hand (Dex)

### Misc Skills
- **dsc** - Decipher Script (Int) - For scholars
- **uro** - Use Rope (Dex)

### Languages
- **spk** - Speak Language (no ability)

### Psionic Skills (if enabled in your D35E setup)
- **aut** - Autohypnosis (Wis)
- **kps** - Knowledge (Psionics) (Int)
- **psi** - Psicraft (Int)
- **upd** - Use Psionic Device (Cha)

### Craft Skills (Subskills)
Use format: `"crfX:CustomName"` where `X` is the slot number (e.g. `crf1`, `crf2`, ...):
- `crf1:Weaponsmithing`
- `crf1:Armorsmithing`
- `crf1:Bowmaking`
- `crf1:Leatherworking`
- `crf1:Alchemy`
- etc.

### Profession Skills (Subskills)
Use format: `"proX:CustomName"`:
- `pro1:Merchant`
- `pro1:Innkeeper`
- `pro1:Sailor`
- `pro1:Farmer`
- `pro1:Miner`
- etc.

### Perform Skills (Subskills)
Use format: `"prfX:CustomName"`:
- `prf1:Sing`
- `prf1:Dance`
- `prf1:Act`
- `prf1:String instruments`
- `prf1:Wind instruments`
- etc.

## Template Examples

### High-Skill Character (Rogue with Int 12)
```json
{
  "id": "rogue-thief",
  "classes": [{ "name": "Rogue", "level": 1 }],
  "abilities": { "int": 12 },
  "skills": [
    { "name": "hid", "ranks": 4, "priority": "high" },
    { "name": "mos", "ranks": 4, "priority": "high" },
    { "name": "slt", "ranks": 4, "priority": "high" },
    { "name": "opl", "ranks": 4, "priority": "high" },
    { "name": "dev", "ranks": 4, "priority": "high" },
    { "name": "src", "ranks": 4, "priority": "high" },
    { "name": "spt", "ranks": 2, "priority": "medium" },
    { "name": "lis", "ranks": 2, "priority": "medium" },
    { "name": "clm", "ranks": 2, "priority": "low" },
    { "name": "tmb", "ranks": 2, "priority": "medium" },
    { "name": "esc", "ranks": 2, "priority": "medium" },
    { "name": "blf", "ranks": 2, "priority": "medium" }
  ]
}
```

### Low-Skill Character (Fighter with Int 10)
```json
{
  "id": "town-guard",
  "classes": [{ "name": "Fighter", "level": 1 }],
  "abilities": { "int": 10 },
  "skills": [
    { "name": "clm", "ranks": 2, "priority": "medium" },
    { "name": "int", "ranks": 2, "priority": "medium" },
    { "name": "jmp", "ranks": 2, "priority": "medium" },
    { "name": "spt", "ranks": 2, "priority": "medium" }
  ]
}
```

### Spellcaster (Wizard with Int 16)
```json
{
  "id": "wizard",
  "classes": [{ "name": "Wizard", "level": 1 }],
  "abilities": { "int": 16 },
  "skills": [
    { "name": "spl", "ranks": 4, "priority": "high" },
    { "name": "kar", "ranks": 4, "priority": "high" },
    { "name": "coc", "ranks": 4, "priority": "high" },
    { "name": "khi", "ranks": 2, "priority": "medium" },
    { "name": "kpl", "ranks": 2, "priority": "low" },
    { "name": "kre", "ranks": 2, "priority": "medium" },
    { "name": "dsc", "ranks": 2, "priority": "low" }
  ]
}
```

### Craftsperson (Expert with Craft skills)
```json
{
  "id": "blacksmith",
  "classes": [{ "name": "Expert (NPC)", "level": 1 }],
  "abilities": { "int": 12 },
  "skills": [
    { "name": "crf1:Weaponsmithing", "ranks": 4, "priority": "high" },
    { "name": "crf2:Armorsmithing", "ranks": 4, "priority": "high" },
    { "name": "apr", "ranks": 4, "priority": "medium" },
    { "name": "pro1:Blacksmith", "ranks": 4, "priority": "high" },
    { "name": "clm", "ranks": 2, "priority": "low" },
    { "name": "han", "ranks": 2, "priority": "low" },
    { "name": "int", "ranks": 2, "priority": "low" },
    { "name": "kar", "ranks": 2, "priority": "low" }
  ]
}
```

## Class Skill Guidelines

### Fighter/Warrior
Focus on: Climb, Intimidate, Jump, Ride, Swim, Spot, Listen

### Rogue
Focus on: All stealth skills, Open Lock, Disable Device, Search, Tumble, Sleight of Hand, Appraise, Bluff

### Wizard/Sorcerer
Focus on: Spellcraft, Knowledge skills, Concentration

### Cleric
Focus on: Concentration, Heal, Knowledge (Religion), Diplomacy

### Bard
Focus on: Perform, Diplomacy, Bluff, Gather Information, all Knowledge skills, Sense Motive

### Ranger
Focus on: Survival, Track, Spot, Listen, Hide, Move Silently, Handle Animal, Knowledge (Nature)

### Druid
Focus on: Survival, Handle Animal, Knowledge (Nature), Heal, Concentration

### Craftspeople/Merchants
Focus on: Craft/Profession, Appraise, Diplomacy, Sense Motive, Gather Information

### Commoners
Focus on: Profession, Handle Animal, simple practical skills related to their occupation

## Tips for Balancing Skills

1. **Max out primary skills** (rank 4 at level 1) for skills central to the character concept
2. **Spread remaining points** across supporting skills (rank 2 each)
3. **Leave headroom** - don't allocate all points at base Int, so high-Int characters can use them
4. **Class skills** get +3 bonus when you put at least 1 rank in them
5. **Cross-class skills** cost 2 points per rank (max rank 2 at level 1)

## Calculating Available Points

Use this formula to ensure your templates work for high-Int characters:

**Maximum possible points = (Base + 4) × 4** (for 18 Int, +4 modifier)

Example for Expert:
- Base: 6
- With Int 18: (6+4)×4 = 40 skill points
- Template should allocate ~28-32 points, leaving room for customization
