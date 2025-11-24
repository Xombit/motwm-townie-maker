# Skills Configuration Guide

This guide explains how to configure skills for character templates in the MOTWM Townie Maker module.

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
- **mov** - Move Silently (Dex) - For rogues, scouts
- **dis** - Disguise (Cha) - For spies, con artists
- **fog** - Forgery (Int) - For forgers, spies

### Physical Skills
- **clm** - Climb (Str)
- **jmp** - Jump (Str)
- **swm** - Swim (Str)
- **rid** - Ride (Dex) - For cavaliers, scouts
- **bal** - Balance (Dex)
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
- **sea** - Search (Int) - For finding traps, hidden objects

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

### Craft Skills (Subskills)
Use format: `"crf1:CustomName"` where you specify your craft type:
- `crf1:Weaponsmithing`
- `crf1:Armorsmithing`
- `crf1:Bowmaking`
- `crf1:Leatherworking`
- `crf1:Alchemy`
- etc.

### Profession Skills (Subskills)
Use format: `"pro1:CustomName"`:
- `pro1:Merchant`
- `pro1:Innkeeper`
- `pro1:Sailor`
- `pro1:Farmer`
- `pro1:Miner`
- etc.

### Perform Skills (Subskills)
Use format: `"prf1:CustomName"`:
- `prf1:Sing`
- `prf1:Dance`
- `prf1:Act`
- `prf1:String instruments`
- `prf1:Wind instruments`
- etc.

## Template Examples

### High-Skill Character (Rogue with Int 12)
```typescript
{
  id: "rogue-thief",
  classes: [{ name: "Rogue", level: 1 }],
  abilities: { int: 12 },  // +1 modifier
  // Skill points: (8+1)×4 = 36
  skills: [
    { name: "hid", ranks: 4 },
    { name: "mov", ranks: 4 },
    { name: "slt", ranks: 4 },
    { name: "opl", ranks: 4 },
    { name: "dev", ranks: 4 },
    { name: "sea", ranks: 4 },
    { name: "spt", ranks: 2 },
    { name: "lis", ranks: 2 },
    { name: "clm", ranks: 2 },
    { name: "tmb", ranks: 2 },
    { name: "esc", ranks: 2 },
    { name: "blf", ranks: 2 }
    // Total: 36 ranks
  ]
}
```

### Low-Skill Character (Fighter with Int 10)
```typescript
{
  id: "town-guard",
  classes: [{ name: "Fighter", level: 1 }],
  abilities: { int: 10 },  // +0 modifier
  // Skill points: (2+0)×4 = 8
  skills: [
    { name: "clm", ranks: 2 },
    { name: "int", ranks: 2 },
    { name: "jmp", ranks: 2 },
    { name: "spt", ranks: 2 }
    // Total: 8 ranks
  ]
}
```

### Spellcaster (Wizard with Int 16)
```typescript
{
  id: "wizard",
  classes: [{ name: "Wizard", level: 1 }],
  abilities: { int: 16 },  // +3 modifier
  // Skill points: (2+3)×4 = 20
  skills: [
    { name: "spl", ranks: 4 },  // Spellcraft - essential
    { name: "kar", ranks: 4 },  // Knowledge (Arcana)
    { name: "coc", ranks: 4 },  // Concentration
    { name: "khi", ranks: 2 },
    { name: "kpl", ranks: 2 },
    { name: "kre", ranks: 2 },
    { name: "dsc", ranks: 2 }
    // Total: 20 ranks
  ]
}
```

### Craftsperson (Expert with Craft skills)
```typescript
{
  id: "blacksmith",
  classes: [{ name: "Expert (NPC)", level: 1 }],
  abilities: { int: 12 },  // +1 modifier
  // Skill points: (6+1)×4 = 28
  skills: [
    { name: "crf1:Weaponsmithing", ranks: 4 },
    { name: "crf2:Armorsmithing", ranks: 4 },
    { name: "apr", ranks: 4 },
    { name: "pro1:Blacksmith", ranks: 4 },
    { name: "clm", ranks: 2 },
    { name: "han", ranks: 2 },
    { name: "int", ranks: 2 },
    { name: "kar", ranks: 2 }
    // Total: 24 ranks (leaving 4 unallocated for high-Int characters)
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

