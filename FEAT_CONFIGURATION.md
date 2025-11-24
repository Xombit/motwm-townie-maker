# Feat Configuration System

## Overview

The MOTWM Townie Maker now supports configurable feats that require special setup in the D&D 3.5e system. This fixes issues where feats like "Spell Focus" or "Weapon Focus" need additional configuration (spell school or weapon type).

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

## Solution

### Type Definition (types.d.ts)

Added a new `FeatConfig` interface:

```typescript
export interface FeatConfig {
  name: string;  // The base feat name to search for in compendiums
  displayName?: string;  // What to show the user (optional)
  config?: {
    spellSchool?: string;  // For Spell Focus: "evo", "nec", "div", "con", "enc", "ill", "abj", "trs"
    weaponGroup?: string;  // For Weapon Focus: "Longsword", "Shortbow", etc.
  };
}
```

Templates can now use either strings (for simple feats) or FeatConfig objects (for configurable feats):

```typescript
feats?: Array<string | FeatConfig>;
```

### Adapter Changes (d35e-adapter.ts)

The `addFeats()` method now:
1. Accepts both string and FeatConfig objects
2. Searches for the base feat name in compendiums
3. Applies configuration to the feat before adding to actor:
   - **Spell Focus/Greater Spell Focus**: Sets `customAttributes._6zv0nkvei.value` to the spell school code
   - **Weapon-based feats**: Finds the "Weapon Name" attribute and sets its value
   - **Skill Focus**: Sets `changes[0][1]` to `skill.{skillId}` format
4. Logs configuration actions for debugging

### Template Updates (templates.ts)

All templates with configurable feats have been updated:

#### Spell Focus Examples

```typescript
// Old format (caused warnings):
feats: ["Spell Focus (Evocation)", ...]

// New format (properly configured):
feats: [
  { 
    name: "Spell Focus (No Spell School Selected)", 
    displayName: "Spell Focus (Evocation)", 
    config: { spellSchool: "evo" } 
  },
  ...
]
```

#### Weapon Focus Examples

```typescript
// Old format (caused warnings):
feats: ["Weapon Focus", ...]

// New format (properly configured):
feats: [
  { 
    name: "Weapon Focus (No Weapon Selected)", 
    displayName: "Weapon Focus (Longsword)", 
    config: { weaponGroup: "Longsword" } 
  },
  ...
]
```

#### Skill Focus Examples

```typescript
// Old format (caused errors):
feats: ["Skill Focus (Diplomacy)", ...]

// New format (properly configured):
feats: [
  { 
    name: "Skill Focus (undefined)", 
    displayName: "Skill Focus (Diplomacy)", 
    config: { skill: "dip" } 
  },
  ...
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

Weapon groups are specified by their full name as they appear in D&D 3.5e:

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
- `"bal"` = Balance
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
- `"mov"` = Move Silently
- `"sen"` = Sense Motive
- `"spt"` = Spot
- `"sur"` = Survival
- Plus many more Knowledge skills (kar, kdu, ken, etc.)

### Subskills (Craft, Profession, Perform)

For skills with subskills, use the format: `"subskillId:CustomName"`

**Craft Skills:**
```typescript
{ skill: "crf1:Armorsmithing" }
{ skill: "crf1:Weaponsmithing" }
{ skill: "crf1:Bowmaking" }
{ skill: "crf1:Leatherworking" }
// etc. - you can use any craft name you want
```

**Profession Skills:**
```typescript
{ skill: "pro1:Innkeeper" }
{ skill: "pro1:Sailor" }
{ skill: "pro1:Farmer" }
{ skill: "pro1:Merchant" }
// etc. - you can use any profession name you want
```

**Perform Skills:**
```typescript
{ skill: "prf1:Sing" }
{ skill: "prf1:Dance" }
{ skill: "prf1:Act" }
{ skill: "prf1:Oratory" }
// etc. - you can use any performance type you want
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

```typescript
{
  id: "my-template",
  name: "My Template",
  race: "Human",
  classes: [{ name: "Fighter", level: 1 }],
  primaryAbility: "str",
  feats: [
    "Power Attack",  // Simple feat (no config needed)
    { 
      name: "Weapon Focus (No Weapon Selected)", 
      displayName: "Weapon Focus (Greatsword)", 
      config: { weaponGroup: "Greatsword" } 
    },  // Configured feat
    "Cleave"  // Another simple feat
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
```typescript
{
  id: "bard-minstrel",
  name: "Traveling Minstrel",
  feats: [
    { name: "Skill Focus (undefined)", displayName: "Skill Focus (Perform)", config: { skill: "prf1:Sing" } }
  ]
}
```

### Blacksmith with Craft (Weaponsmithing)
```typescript
{
  id: "blacksmith",
  name: "Blacksmith",
  feats: [
    { name: "Skill Focus (undefined)", displayName: "Skill Focus (Craft)", config: { skill: "crf1:Weaponsmithing" } }
  ]
}
```

### Sailor with Profession (Sailor)
```typescript
{
  id: "sailor",
  name: "Ship's Sailor",
  feats: [
    { name: "Skill Focus (undefined)", displayName: "Skill Focus (Profession)", config: { skill: "pro1:Sailor" } }
  ]
}
```

### Wizard with Spell Focus
```typescript
{
  id: "evoker",
  name: "Evoker Wizard",
  feats: [
    { name: "Spell Focus (No Spell School Selected)", displayName: "Spell Focus (Evocation)", config: { spellSchool: "evo" } }
  ]
}
```

### Fighter with Weapon Focus
```typescript
{
  id: "greatsword-fighter",
  name: "Greatsword Fighter",
  feats: [
    { name: "Weapon Focus (No Weapon Selected)", displayName: "Weapon Focus (Greatsword)", config: { weaponGroup: "Greatsword" } }
  ]
}
```

## Technical Details

The feat configuration system works by:
1. Finding the base feat document in compendiums by name
2. Converting it to a plain object with `.toObject()`
3. Modifying the appropriate fields:
   - **Spell Focus**: sets `system.customAttributes._6zv0nkvei.value` to the school code
   - **Weapon Focus**: finds the weapon attribute and sets its value
   - **Skill Focus (standard)**: sets `system.changes[0][1]` to `skill.{skillId}`
   - **Skill Focus (subskill)**: sets `system.changes[0][1]` to `skill.{base}.subSkills.{subskillId}` and stores custom name
4. Creating the item on the actor with the modified data

This ensures feats are added with all required selections already configured, eliminating manual setup and console warnings.
