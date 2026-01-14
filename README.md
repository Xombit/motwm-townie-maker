# MOTWM Townie Maker

A comprehensive NPC and adversary creation tool for Foundry VTT's D35E (D&D 3.5e) system. Generate fully-equipped, combat-ready characters in seconds using intelligent templates and automated systems.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Character Templates](#character-templates)
- [Core Systems](#core-systems)
  - [Ability Scores](#ability-scores)
  - [Class & Level](#class--level)
  - [Race Selection](#race-selection)
  - [Skill Allocation](#skill-allocation)
  - [Feat Selection](#feat-selection)
  - [Equipment System](#equipment-system)
  - [Magic Item System](#magic-item-system)
  - [Spell System](#spell-system)
  - [Consumables](#consumables)
- [Configuration Options](#configuration-options)
- [Loot & Token Options](#loot--token-options)
- [Development](#development)
- [License](#license)
- [Credits](#credits)

---

## Overview

**MOTWM Townie Maker** solves the common GM problem of needing quick, balanced NPCs for encounters. Instead of spending hours building characters by hand or using generic stat blocks, Townie Maker generates fully-realized characters with:

- Appropriate equipment for their level and class
- Magic items following "Big Six" priority guidelines
- Properly allocated skills based on class priorities
- Level-appropriate feats with correct configurations
- Prepared spells for caster classes
- Consumables (wands, scrolls, potions) based on character type
- Randomized wealth in realistic coin denominations

The goal is to create NPCs that feel like real adventurers who could plausibly exist in your game world.

## Features

### Core Features
- **20+ Character Templates** - Predefined archetypes for common NPCs
- **Levels 1-20** - Full support for all character levels
- **11 Core Classes** - Fighter, Barbarian, Monk, Paladin, Ranger, Rogue, Bard, Cleric, Druid, Sorcerer, Wizard
- **5 NPC Classes** - Adept, Aristocrat, Commoner, Expert, Warrior
- **12 Races** - Human, Elves (High/Wood/Drow), Dwarves (Hill/Mountain), Gnome, Halfling, Half-Elf, Half-Orc, Aasimar, Tiefling

### Intelligent Systems
- **Wealth-by-Level** - Automatic wealth calculation from DMG guidelines
- **Smart Equipment** - Level-scaled mundane and magic equipment
- **Magic Item Budget** - Class-appropriate budget allocation (martial vs. caster vs. divine)
- **Big Six Priority** - Weapon, Armor, Stat Booster, Cloak of Resistance, Ring of Protection, Amulet of Natural Armor
- **Spell Preparation** - Automatic spell selection and preparation for casters
- **Consumable Allocation** - Wands, scrolls, and potions based on class type

### Quality of Life
- **Random Name Generation** - Race and gender-appropriate fantasy names
- **Portrait & Token Images** - Automatic image selection based on race/class/gender
- **Coin Randomization** - Realistic distribution across pp/gp/sp/cp
- **Unidentified Magic Items** - Perfect for loot with generic base item names
- **Bank Deposit Slips** - Excess wealth as in-game prop items
- **Token Disposition** - Set default attitude (Friendly/Neutral/Hostile)

---

## Installation

### Method 1: Manifest URL (Recommended)
1. In Foundry VTT, go to **Add-on Modules**
2. Click **"Install Module"**
3. Paste the manifest URL:
   ```
   https://github.com/Xombit/motwm-townie-maker/releases/latest/download/module.json
   ```
4. Click **"Install"**

### Method 2: Manual Installation
1. Download the latest release from GitHub
2. Extract to your `modules` folder
3. Restart Foundry VTT

### Requirements
- Foundry VTT v10 or v11
- D35E System v2.1.3 or higher

---

## Quick Start

1. **Enable the module** in your world's Module Settings
2. **Click the anvil icon** (🔨) in the scene controls sidebar
3. **Select a template** from the gallery (e.g., "Town Guard")
4. **Adjust level** to desired character level
5. **Click "Create NPC"** to generate the character

The character will be created with:
- Full equipment appropriate for their level
- Magic items based on wealth-by-level guidelines
- Prepared spells (if applicable)
- Properly allocated skills and feats
- Random name, portrait, and token

---

## Character Templates

Templates provide pre-configured character concepts with appropriate class, race, ability scores, skills, feats, and starting equipment.

### Martial Templates

| Template | Class | Race | Description |
|----------|-------|------|-------------|
| **Town Guard** | Warrior (NPC) | Human | City watch, gate guards, patrol officers |
| **Bandit** | Rogue | Human | Highway robber, camp raider |
| **Tribal Warrior** | Barbarian | Half-Orc | Fierce wilderness warrior |
| **Holy Knight** | Paladin | Human | Righteous champion of good |
| **Ranger Scout** | Ranger | Human | Wilderness tracker and archer |
| **Monastery Disciple** | Monk | Human | Martial artist and ascetic |

### Caster Templates

| Template | Class | Race | Description |
|----------|-------|------|-------------|
| **Arcane Scholar** | Wizard | Elf | Academic magic-user |
| **Temple Priest** | Cleric | Human | Divine spellcaster |
| **Village Healer** | Cleric | Human | Healing-focused divine caster |
| **Forest Hermit** | Druid | Human | Nature guardian |
| **Born Spellcaster** | Sorcerer | Human | Innate magic wielder |
| **Traveling Minstrel** | Bard | Half-Elf | Entertainer and storyteller |

### NPC Templates

| Template | Class | Race | Description |
|----------|-------|------|-------------|
| **Merchant** | Expert (NPC) | Human | Shopkeeper, trader |
| **Tavern Keeper** | Expert (NPC) | Human | Innkeeper, bartender |
| **Blacksmith** | Expert (NPC) | Human | Weaponsmith, armorer |
| **Innkeeper** | Expert (NPC) | Halfling | Hospitality professional |
| **Farmer** | Commoner (NPC) | Human | Agricultural worker |
| **Street Urchin** | Rogue | Halfling | Street-smart survivor |
| **Fortune Teller** | Adept (NPC) | Human | Mystic, seer |
| **Noble** | Aristocrat (NPC) | Human | Lord, lady, courtier |
| **Cultist** | Adept (NPC) | Human | Dark magic practitioner |

### Specialized Templates

| Template | Class | Race | Description |
|----------|-------|------|-------------|
| **Street Thief** | Rogue | Halfling | Urban sneak thief |

---

## Core Systems

### Ability Scores

The module supports two methods for generating ability scores:

#### Standard Array (Default)
Uses the standard D&D point-buy equivalent: **15, 14, 13, 12, 10, 8**

Templates assign these values to abilities based on class priorities:
- **Fighters**: STR 15, CON 14, DEX 13, WIS 12, INT 10, CHA 8
- **Wizards**: INT 15, DEX 14, CON 13, WIS 12, STR 10, CHA 8
- **Rogues**: DEX 15, INT 14, CON 13, WIS 12, STR 10, CHA 8

#### 4d6 Drop Lowest
Rolls 4d6, drops the lowest die, for each ability score. Results are assigned based on template ability priorities.

#### Manual Override
All ability scores can be manually adjusted in the Character tab after selecting a template.

---

### Class & Level

#### Supported Classes

**Core Classes (d20 SRD)**
- Fighter, Barbarian, Monk, Paladin, Ranger, Rogue
- Bard, Cleric, Druid, Sorcerer, Wizard

**NPC Classes**
- Warrior (NPC) - Simple combatant
- Expert (NPC) - Skilled professional
- Commoner (NPC) - Average citizen
- Aristocrat (NPC) - Noble or merchant
- Adept (NPC) - Minor spellcaster

#### Level Scaling

Equipment and wealth scale automatically with level:

| Level | Wealth (gp) | Magic Item Tier |
|-------|-------------|-----------------|
| 1 | Class starting | None |
| 3 | 2,700 | +1 weapon/armor |
| 5 | 9,000 | +1 with abilities |
| 8 | 27,000 | +2, stat boosters |
| 12 | 88,000 | +3, multiple items |
| 15 | 200,000 | +4, powerful items |
| 20 | 760,000 | +5, epic tier |

---

### Race Selection

#### Supported Races

| Race | Ability Adjustments |
|------|---------------------|
| Human | +2 to any |
| Elf, High | +2 DEX, -2 CON |
| Elf, Wood | +2 STR, -2 INT |
| Elf, Drow | +2 DEX, -2 CON |
| Dwarf, Hill | +2 CON, -2 CHA |
| Dwarf, Mountain | +2 CON, -2 CHA |
| Gnome, Rock | +2 CON, -2 STR |
| Halfling, Lightfoot | +2 DEX, -2 STR |
| Half-Elf | None |
| Half-Orc | +2 STR, -2 INT, -2 CHA |
| Aasimar | +2 WIS, +2 CHA |
| Tiefling | +2 DEX, +2 INT, -2 CHA |

Each race has custom name pools for realistic fantasy name generation.

---

### Skill Allocation

Skills are allocated using a priority system:

#### Priority Levels
- **High Priority**: Receives maximum possible ranks (level + 3)
- **Medium Priority**: Receives moderate ranks
- **Low Priority**: Receives minimal ranks

#### Class Skill Points
Skill points are calculated correctly per class:
- Fighter: 2 + INT modifier per level
- Rogue: 8 + INT modifier per level
- Wizard: 2 + INT modifier per level
- etc.

First level characters receive 4× skill points as per 3.5e rules.

#### Template Skills
Each template defines appropriate skills for the character concept:
- **Town Guard**: Spot (high), Listen (high), Intimidate (medium)
- **Street Thief**: Hide (high), Move Silently (high), Open Lock (high)
- **Wizard**: Spellcraft (high), Concentration (high), Knowledge (Arcana) (medium)

---

### Feat Selection

#### Standard Feat Progression
Characters receive feats at levels 1, 3, 6, 9, 12, 15, 18.
Humans receive a bonus feat at level 1.

#### Class Bonus Feats
- **Fighter**: Bonus feats at 1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20
- **Wizard**: Bonus feats at 5, 10, 15, 20
- **Monk**: Bonus feats at 1, 2, 6
- **Ranger**: Combat style feats at 2, 6, 11

#### Feat Configurations
Feats requiring choices are automatically configured:
- **Weapon Focus**: Configured for template's primary weapon
- **Spell Focus**: Configured for appropriate school
- **Skill Focus**: Configured for class-appropriate skill
- **Improved Critical**: Configured for primary weapon

Example: A Fighter template with a longsword gets:
- `Weapon Focus (Longsword)`
- `Weapon Specialization (Longsword)`
- `Improved Critical (Longsword)`

---

### Equipment System

#### Starting Kits
Each template defines a starting equipment kit:

```
Weapons: Longsword, Light Crossbow
Armor: Scale Mail
Shield: Heavy Steel Shield
Gear: Backpack, Bedroll, Waterskin, Trail Rations
Tools: Rope, Flint and Steel
```

#### Level Scaling
Some equipment scales with level:
- Level 1-4: Leather armor
- Level 5-9: Chain shirt
- Level 10+: Breastplate or full plate

#### Equipment Categories
- **Weapons**: Primary and secondary weapons
- **Armor**: Body armor appropriate for class
- **Shield**: If proficient
- **Ammunition**: Arrows, bolts, sling bullets
- **Gear**: Adventuring equipment
- **Tools**: Class-specific tools (thieves' tools, holy symbol, spell components)

---

### Magic Item System

The magic item system allocates budget based on the "Big Six" priority system used by experienced D&D 3.5e players.

#### Budget Allocation by Class Type

**Martial Classes** (Fighter, Barbarian, etc.)
| Category | Budget |
|----------|--------|
| Weapon Enhancement | 38% |
| Armor Enhancement | 34% |
| Stat Booster | 12% |
| Cloak of Resistance | 7% |
| Ring/Amulet (AC) | 7% |
| Consumables | 2% |

**Divine Casters** (Cleric, Druid)
| Category | Budget |
|----------|--------|
| Weapon Enhancement | 0% |
| Armor Enhancement | 28% |
| Stat Booster | 18% |
| Cloak of Resistance | 12% |
| Ring/Amulet (AC) | 10% |
| Consumables | 12% |
| Rods/Staves | 20% |

**Arcane Casters** (Wizard, Sorcerer)
| Category | Budget |
|----------|--------|
| Weapon Enhancement | 0% |
| Armor Enhancement | 0% |
| Stat Booster | 22% |
| Cloak of Resistance | 14% |
| Ring/Amulet (AC) | 14% |
| Consumables | 18% |
| Rods/Staves | 32% |

#### Big Six Items

1. **Weapon Enhancement**: +1 to +5 with special abilities (Flaming, Keen, etc.)
2. **Armor Enhancement**: +1 to +5 with special abilities (Fortification, etc.)
3. **Stat Booster**: Belt of Giant Strength, Headband of Intellect, etc.
4. **Cloak of Resistance**: +1 to +5 saves
5. **Ring of Protection**: +1 to +5 deflection AC
6. **Amulet of Natural Armor**: +1 to +5 natural AC

#### Enhancement Selection

Weapon enhancements are chosen based on class and weapon type:
- **Two-handed weapons**: Keen, Power Attack support
- **Archer weapons**: Distance, Seeking
- **Rogue weapons**: Keen (for sneak attack criticals)
- **Divine weapons**: Holy, Disruption

Armor enhancements prioritize defense:
- **Frontline fighters**: Fortification (Light → Moderate → Heavy)
- **Rogues**: Shadow, Silent Moves
- **Casters**: Energy Resistance

---

### Spell System

#### Supported Caster Types

| Class | Type | Ability | Spellbook |
|-------|------|---------|-----------|
| Wizard | Prepared | INT | Yes |
| Sorcerer | Spontaneous | CHA | No |
| Cleric | Prepared | WIS | Domain |
| Druid | Prepared | WIS | Nature |
| Bard | Spontaneous | CHA | No |
| Paladin | Prepared | CHA | Yes (4th level) |
| Ranger | Prepared | WIS | Yes (4th level) |

#### Spell Selection

Spells are selected based on:
1. **Class spell list** from D35E compendium
2. **Level availability** (can't prepare spells you can't cast)
3. **Role priorities** (blaster, healer, buffer, utility)

Example Wizard spells at level 5:
- 0th: Detect Magic, Read Magic, Light, Mage Hand
- 1st: Magic Missile, Shield, Mage Armor, Grease
- 2nd: Scorching Ray, Web, Invisibility
- 3rd: Fireball, Haste

#### Spell Slot Calculation

Spell slots are calculated correctly including:
- Base slots from class level
- Bonus slots from casting ability
- Domain slots for Clerics

---

### Consumables

#### Wands
Selected based on class spell list:
- **Wizard**: Wand of Magic Missile, Wand of Scorching Ray
- **Cleric**: Wand of Cure Light Wounds, Wand of Bless
- **Druid**: Wand of Entangle, Wand of Cure Moderate Wounds

Wands are created with appropriate charges based on budget.

#### Scrolls
Emergency spells and utility options:
- **Wizard**: Scroll of Dispel Magic, Scroll of Fly
- **Cleric**: Scroll of Remove Disease, Scroll of Restoration

#### Potions
Available to all classes (no UMD required):
- Potion of Cure Light Wounds
- Potion of Bull's Strength
- Potion of Cat's Grace
- Potion of Invisibility

Martial characters receive higher potion budgets since they can't use wands/scrolls without Use Magic Device.

---

## Configuration Options

### Config Tab Settings

#### Character Options
| Setting | Description | Default |
|---------|-------------|---------|
| **Use Standard Budget** | Follow wealth-by-level guidelines | ✓ Enabled |
| **Use PC Sheet** | Use full character sheet instead of Simple NPC | ✓ Enabled |
| **Max HP per HD** | Give maximum HP instead of rolling | ☐ Disabled |

#### Budget Percentages
Fine-tune magic item budget allocation:
- **Shield %**: Percentage of armor budget for shield enhancement
- **Armor %**: Percentage of armor budget for body armor
- **Secondary Weapon %**: Budget for backup weapons
- **Ring %**: Percentage of protection budget for Ring of Protection
- **Amulet %**: Percentage of protection budget for Amulet of Natural Armor

---

## Loot & Token Options

### Loot Options

#### Identify Magic Items
| Setting | Behavior |
|---------|----------|
| ✓ Enabled | Magic items created as identified (player-ready) |
| ☐ Disabled | Magic items created as unidentified with generic names |

When disabled, items use base type names for unidentified state:
- "+2 Flaming Longsword" → Unidentified: "Longsword"
- "Ring of Protection +3" → Unidentified: "Ring"
- "Cloak of Resistance +4" → Unidentified: "Cloak"

This is perfect for creating NPCs whose equipment will become player loot.

#### Extra Money in Bank
| Setting | Behavior |
|---------|----------|
| ✓ Enabled | Unused gold becomes a bank deposit slip item |
| ☐ Disabled | Unused gold is lost |

The deposit slip is a Loot-type item containing:
- Remaining gold after equipment purchases
- Pocket change (random 50-100% of level 1 starting wealth)

#### Bank Name
Customizable bank name for deposit slips.
Default: "The First Bank of Lower Everbrook"

### Token Options

#### Token Disposition
Sets the default attitude for the character's token:

| Setting | DISPOSITION Value | Behavior |
|---------|-------------------|----------|
| Friendly | 1 | Green border, won't trigger combat |
| Neutral | 0 | Yellow border (default) |
| Hostile | -1 | Red border, triggers combat |

---

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

---

## Technical Details

### System Requirements
- **Foundry VTT**: Version 10 or 11
- **Game System**: D35E v2.1.3+

### Compendium Dependencies
The module uses these D35E compendiums:
- `D35E.races` - Race data
- `D35E.classes` - Class data and progression
- `D35E.feats` - Feat definitions
- `D35E.spells` - Spell definitions
- `D35E.magicitems` - Wondrous items
- `D35E.weapons-and-ammo` - Weapon definitions
- `D35E.armors-and-shields` - Armor definitions
- `D35E.enhancements` - Weapon/armor enhancements

### Image Requirements
Character portraits and tokens are loaded from:
```
modules/motwm-townie-maker/images/artwork/[class]/[race]/[gender]/[portraits|tokens]/
```

File naming convention:
- `femalehumanfighterportrait01.webp`
- `femalehumanfightertoken01.webp`

Portrait and token with matching numbers are paired sets.

### Module Settings
Located in Module Settings:

| Setting | Options | Description |
|---------|---------|-------------|
| Default Actor Type | Character, NPC | Type of actor to create |
| Auto Roll HP | Yes, No | Automatically roll HP on creation |
| Ability Score Method | Standard Array, 4d6 Drop Lowest | How to generate abilities |
| Default Folder | Text | Folder name for new actors |
| Default Sheet Type | PC Sheet, Simple NPC | Which character sheet to use |

---

## License

MIT License - See [LICENSE](LICENSE) file for details.

---

## Credits

### Created By
**Xombit**

### Special Thanks
- The D35E development team for the excellent 3.5e implementation
- The Foundry VTT community for inspiration and support

### Art Credits
Character portraits and tokens should be attributed according to their individual licenses.

---

## Support

- **Issues**: Report bugs on [GitHub Issues](https://github.com/Xombit/motwm-townie-maker/issues)
- **Discussion**: Join the conversation on the Foundry VTT Discord

---

*MOTWM Townie Maker is not affiliated with, endorsed, sponsored, or specifically approved by Wizards of the Coast LLC. This module is for use with the D35E game system, which implements the d20 System Reference Document under the Open Game License.*
