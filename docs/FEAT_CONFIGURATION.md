# Feat Configuration (Templates)

## Overview

Townie Maker supports “configured feats” for D35E feats that require a choice (spell school, weapon, skill, etc.). This avoids broken feat entries like “No Spell School Selected” or “(undefined)”, and prevents Foundry warnings.

Feat configuration is authored in the runtime templates file: `data/templates.json`.

## Problem Solved

In D&D 3.5e, some feats require you to select a specialization:
- **Spell Focus** requires selecting a spell school (Evocation, Necromancy, etc.)
- **Greater Spell Focus** requires selecting a spell school
- **Weapon Focus** requires selecting a weapon (Longsword, Shortbow, etc.)
- **Weapon Specialization** requires selecting a weapon
- **Greater Weapon Focus** requires selecting a weapon
- **Greater Weapon Specialization** requires selecting a weapon
- **Improved Critical** requires selecting a weapon
- **Skill Focus** requires selecting a skill (Appraise, Diplomacy, etc.)

Previously, the system would add these feats with "No Spell School Selected", "No Weapon Selected", or "(undefined)" for skills, which would show warnings in the Foundry VTT log and the feats wouldn't function correctly.

## Template format

In `data/templates.json`, a template’s `feats` list can contain:

- A **string** (simple feats)
- An **object** (configured feats)

Configured feat objects use:

- `name`: the exact feat name to look up (usually the “unconfigured” compendium entry)
- `displayName` (optional): how it should appear on the actor
- `config`: configuration values (spell school / weapon / skill)

All templates with configurable feats should follow the established patterns already in `data/templates.json`.

#### Spell Focus Examples

```json
[
  {
    "name": "Spell Focus (No Spell School Selected)",
    "displayName": "Spell Focus (Evocation)",
    "config": { "spellSchool": "evo" }
  }
]
```

#### Weapon Focus Examples

```json
[
  {
    "name": "Weapon Focus (No Weapon Selected)",
    "displayName": "Weapon Focus (Longsword)",
    "config": { "weaponGroup": "Longsword" }
  }
]
```

#### Skill Focus Examples

```json
[
  {
    "name": "Skill Focus (undefined)",
    "displayName": "Skill Focus (Diplomacy)",
    "config": { "skill": "dip" }
  }
]
```

## Spell School Codes

Based on the D35E system, the spell school codes are:

- `"evo"` = Evocation
- `"nec"` = Necromancy
- `"div"` = Divination
- `"con"` = Conjuration
- `"enc"` = Enchantment
- `"ill"` = Illusion
- `"abj"` = Abjuration
- `"trs"` = Transmutation

## Weapon Types

Despite the property name `weaponGroup`, the module currently treats this value as a **weapon name**.

Use the weapon's full name as it appears in your D35E system (e.g., in weapon lists / compendium entries):

- `"Longsword"`
- `"Shortbow"`
- `"Longbow"`
- `"Greataxe"`
- `"Greatsword"`
- `"Battleaxe"`
- `"Warhammer"`
- etc.

## Skill IDs (for Skill Focus)

D35E uses abbreviated skill IDs. Common skills:

### Standard Skills

- `"apr"` = Appraise
- "blc" = Balance
- `"blf"` = Bluff
- `"clm"` = Climb
- `"coc"` = Concentration
- `"dip"` = Diplomacy
- `"dev"` = Disable Device
- `"dis"` = Disguise
- `"esc"` = Escape Artist
- `"hea"` = Heal
- `"hid"` = Hide
- `"int"` = Intimidate
- `"lis"` = Listen
- "mos" = Move Silently
- `"sen"` = Sense Motive
- `"spt"` = Spot
- `"sur"` = Survival
- Plus many more Knowledge skills (kar, kdu, ken, etc.)

### Subskills (Craft, Profession, Perform)

For skills with subskills, use the format: `"subskillId:CustomName"`

**Craft Skills:**
```json
{ "skill": "crf1:Armorsmithing" }
```

**Profession Skills:**
```json
{ "skill": "pro1:Sailor" }
```

**Perform Skills:**
```json
{ "skill": "prf1:Sing" }
```

**Important Notes:**
- The subskill ID (crf1, pro1, prf1, etc.) determines which skill slot to use
- The custom name after the colon appears in the feat name: "Skill Focus (Sing)"
- You can use any custom name you want - it will be displayed in the character sheet
- Multiple characters can use the same slot (crf1, pro1, prf1) but with different custom names

## Templates Updated

The following templates have been updated with proper feat configuration:

### Martial Classes
- **Town Guard** - Longsword focus
- **Bandit** - Shortbow focus
- **Ranger Scout** - Longbow focus
- **Barbarian** - Greataxe focus
- **Paladin** - Longsword focus

### Spellcasting Classes
- **Fortune Teller** - Divination focus
- **Dark Cultist** - Necromancy focus
- **Wizard** - Evocation focus
- **Cleric** - Conjuration focus
- **Bard** - Enchantment focus
- **Druid** - Conjuration focus
- **Sorcerer** - Evocation focus

## Adding New Templates

When creating new templates with configurable feats:

1. Use the base feat name from the D35E compendium
2. Provide a displayName for clarity
3. Include the appropriate config object with spellSchool or weaponGroup
4. Reference this document for the correct codes

### Example Template

```json
{
  "id": "my-template",
  "name": "My Template",
  "race": "Human",
  "classes": [{ "name": "Fighter", "level": 1 }],
  "primaryAbility": "str",
  "feats": [
    "Power Attack",
    {
      "name": "Weapon Focus (No Weapon Selected)",
      "displayName": "Weapon Focus (Greatsword)",
      "config": { "weaponGroup": "Greatsword" }
    },
    "Cleave"
  ]
}
```

## Testing

After this update:
1. Restart Foundry VTT
2. Create a character using a template with configured feats
3. Check the browser console - no more warnings about missing configurations
4. Open the character sheet and verify:
   - Spell Focus shows the correct school: "Spell Focus (Evocation)"
   - Weapon Focus shows the correct weapon: "Weapon Focus (Longsword)"
   - Skill Focus shows the correct skill: "Skill Focus (Sing)" not "Skill Focus (undefined)"
5. Verify feat bonuses apply correctly

## Complete Examples

### Bard with Perform (Sing)
```json
{
  "id": "bard-minstrel",
  "name": "Traveling Minstrel",
  "feats": [
    {
      "name": "Skill Focus (undefined)",
      "displayName": "Skill Focus (Perform)",
      "config": { "skill": "prf1:Sing" }
    }
  ]
}
```

### Blacksmith with Craft (Weaponsmithing)
```json
{
  "id": "blacksmith",
  "name": "Blacksmith",
  "feats": [
    {
      "name": "Skill Focus (undefined)",
      "displayName": "Skill Focus (Craft)",
      "config": { "skill": "crf1:Weaponsmithing" }
    }
  ]
}
```

### Sailor with Profession (Sailor)
```json
{
  "id": "sailor",
  "name": "Ship's Sailor",
  "feats": [
    {
      "name": "Skill Focus (undefined)",
      "displayName": "Skill Focus (Profession)",
      "config": { "skill": "pro1:Sailor" }
    }
  ]
}
```

### Wizard with Spell Focus
```json
{
  "id": "evoker",
  "name": "Evoker Wizard",
  "feats": [
    {
      "name": "Spell Focus (No Spell School Selected)",
      "displayName": "Spell Focus (Evocation)",
      "config": { "spellSchool": "evo" }
    }
  ]
}
```

### Fighter with Weapon Focus
```json
{
  "id": "greatsword-fighter",
  "name": "Greatsword Fighter",
  "feats": [
    {
      "name": "Weapon Focus (No Weapon Selected)",
      "displayName": "Weapon Focus (Greatsword)",
      "config": { "weaponGroup": "Greatsword" }
    }
  ]
}
```

## Implementation reference (for contributors)

Configured feats are applied during actor creation in the D35E adapter. If you need to change how feat configuration is written into D35E items, start in `src/d35e-adapter.ts` (feat adding logic).

Note: the exact internal D35E item fields used for configuration can change between system versions, so prefer validating behavior via the in-game sheet + console logs rather than relying on hard-coded field IDs documented here.
