# Magic Enhancement System Analysis
## How D35E Handles Enhancements - Complete Implementation Guide

Based on examination of actual Foundry VTT D35E enhancement items exported from the system.

---

## Enhancement Types

### 1. Base Enhancement Bonus (+1 to +5)
**Purpose**: Provides numerical bonus to attack/damage (weapons) or AC (armor)

**Compendium References**:
- Weapons: `Compendium.D35E.enhancements.Ng5AlRupmkMOgqQi` ("+1 Weapon Enhancement")
- Armor: `Compendium.D35E.enhancements.iOhtLsgtgmt2l9CM` ("+1 Armor Enhancement")

**Key Fields**:
```json
{
  "name": "+1 Weapon Enhancement",
  "type": "enhancement",
  "system": {
    "enhancementType": "weapon",  // or "armor"
    "enh": 3,                      // Set to desired bonus level
    "enhIncrease": 3,              // Same as enh
    "enhIsLevel": false,           // Always false for base enhancements
    "enhIncreaseFormula": "@enhancement",
    "nameExtension": {
      "prefix": "",
      "suffix": ""
    }
  }
}
```

**Pricing**: Uses enhancement bonus squared formula
- +1 = 2,000 gp
- +2 = 8,000 gp  
- +3 = 18,000 gp
- +4 = 32,000 gp
- +5 = 50,000 gp

---

### 2. Special Weapon Abilities
**Purpose**: Add special effects (Flaming, Keen, Vorpal, etc.)

#### Example: Flaming (+1 bonus level)
**Compendium**: `Compendium.D35E.enhancements.8ymQFRb8BnIsKViV`

```json
{
  "name": "Flaming",
  "type": "enhancement",
  "system": {
    "enhancementType": "weapon",
    "enh": 0,                      // Special abilities have enh: 0
    "enhIncrease": 1,              // Costs +1 bonus level
    "enhIsLevel": true,            // TRUE for special abilities!
    "enhIncreaseFormula": "1",
    "nameExtension": {
      "prefix": "Flaming",         // Goes BEFORE weapon name
      "suffix": ""
    },
    "weaponData": {
      "damageRoll": "1d6",         // Extra damage
      "damageType": "Fire",
      "damageTypeId": "energy-fire"
    },
    "allowedTypes": [["weapon"]]
  }
}
```

**Effect**: Adds 1d6 fire damage on hit

#### Example: Vorpal (+5 bonus levels!)
```json
{
  "name": "Vorpal",
  "type": "enhancement",
  "system": {
    "enhancementType": "weapon",
    "enh": 0,
    "enhIncrease": 5,              // Very expensive - costs +5 levels!
    "enhIsLevel": false,           // FALSE here (inconsistent with Flaming?)
    "enhIncreaseFormula": "5",
    "nameExtension": {
      "prefix": "Vorpal",
      "suffix": ""
    },
    "attackNotes": "Upon a roll of natural 20 (followed by a successful roll to confirm the critical hit), the weapon severs the opponent's head (if it has one) from its body.",
    "allowedTypes": [
      ["weapon"],
      ["melee"],
      ["slashing"]                 // RESTRICTED: Only slashing weapons!
    ],
    "requirements": "CL 18th; Craft Magic Arms and Armor, circle of death, keen edge"
  }
}
```

**Effect**: Natural 20 + confirmed crit = instant decapitation

---

### 3. Special Armor Abilities

#### Example: Invulnerability (+3 bonus levels)
**Compendium**: `Compendium.D35E.enhancements.mTRqWfCH1G5qWVie`

```json
{
  "name": "Invulnerability",
  "type": "enhancement",
  "system": {
    "enhancementType": "armor",
    "enh": 0,
    "enhIncrease": 3,              // Costs +3 bonus levels
    "enhIsLevel": false,
    "enhIncreaseFormula": "3",
    "nameExtension": {
      "prefix": "",
      "suffix": "Invulnerability"  // Goes AFTER armor name with "of"
    },
    "damageReduction": [
      ["5", "magic"]                // DR 5/magic
    ],
    "allowedTypes": [["armor"]],
    "requirements": "CL 18th; Craft Magic Arms and Armor, stoneskin, wish or miracle"
  }
}
```

**Effect**: DR 5/magic (reduces damage by 5 unless from magic weapon)

---

## Complete Item Structure

### Example: Flaming Longsword +3

**Total Cost Calculation**:
```
Base Longsword:     15 gp
Masterwork:        300 gp
Enhancement:    32,000 gp  (+3 enhancement + Flaming +1 = +4 total levels)
────────────────────────
TOTAL:          32,315 gp
```

**JSON Structure**:
```json
{
  "name": "Flaming Longsword +3",          // Manual update required!
  "type": "weapon",
  "system": {
    "price": 32315,                         // Manual update required!
    "identifiedName": "Flaming Longsword +3",
    "masterwork": true,                     // MUST be true!
    "enh": 3,                               // Base enhancement only
    "enhancements": {
      "automation": {
        "updateName": false,                // System won't auto-update
        "updatePrice": false                // System won't auto-update
      },
      "items": [
        {
          "_id": "Ng5AlRupmkMOgqQi",
          "name": "+1 Weapon Enhancement",
          "type": "enhancement",
          "flags": {
            "core": {
              "sourceId": "Compendium.D35E.enhancements.Ng5AlRupmkMOgqQi"
            }
          },
          "system": {
            "enhancementType": "weapon",
            "enh": 3,                       // Set to +3
            "enhIncrease": 3
          }
        },
        {
          "_id": "8ymQFRb8BnIsKViV",
          "name": "Flaming",
          "type": "enhancement",
          "flags": {
            "core": {
              "sourceId": "Compendium.D35E.enhancements.8ymQFRb8BnIsKViV"
            }
          },
          "system": {
            "enhancementType": "weapon",
            "enh": 0,
            "enhIncrease": 1,               // Costs +1 level
            "weaponData": {
              "damageRoll": "1d6",
              "damageType": "Fire"
            },
            "nameExtension": {
              "prefix": "Flaming"
            }
          }
        }
      ]
    }
  }
}
```

---

## Implementation Strategy for Townie Maker

### Option 1: Use System Compendiums (Recommended)
**Pros**: 
- Uses official D35E enhancement definitions
- All mechanics pre-configured
- Updates with system changes

**Cons**:
- Requires game object access
- More complex API calls

**Implementation**:
```typescript
async function applyEnhancementsFromCompendium(
  item: any,
  enhancementBonus: number,
  specialAbilities: string[] = []
): Promise<any> {
  
  // 1. Get base enhancement from compendium
  const enhType = item.type === 'weapon' ? 'weapon' : 'armor';
  const baseEnhId = enhType === 'weapon' 
    ? 'Ng5AlRupmkMOgqQi'  // +1 Weapon Enhancement
    : 'iOhtLsgtgmt2l9CM'; // +1 Armor Enhancement
  
  const pack = game.packs.get('D35E.enhancements');
  const baseEnh = await pack.getDocument(baseEnhId);
  const baseEnhData = baseEnh.toObject();
  
  // Set enhancement level
  baseEnhData.system.enh = enhancementBonus;
  baseEnhData.system.enhIncrease = enhancementBonus;
  
  // 2. Initialize enhancements array
  if (!item.system.enhancements) {
    item.system.enhancements = {
      uses: { value: 0, max: 0, per: null, autoDeductCharges: true, allowMultipleUses: false, commonPool: true },
      automation: { updateName: false, updatePrice: false },
      clFormula: "",
      spellcastingAbility: "",
      items: []
    };
  }
  
  item.system.enhancements.items.push(baseEnhData);
  
  // 3. Add special abilities
  let totalBonusLevels = enhancementBonus;
  let namePrefix = "";
  let nameSuffix = "";
  
  for (const abilityId of specialAbilities) {
    const ability = await pack.getDocument(abilityId);
    const abilityData = ability.toObject();
    
    totalBonusLevels += abilityData.system.enhIncrease;
    
    if (abilityData.system.nameExtension.prefix) {
      namePrefix = abilityData.system.nameExtension.prefix + " " + namePrefix;
    }
    if (abilityData.system.nameExtension.suffix) {
      nameSuffix += (nameSuffix ? ", " : " of ") + abilityData.system.nameExtension.suffix;
    }
    
    item.system.enhancements.items.push(abilityData);
  }
  
  // 4. Update item properties
  item.system.masterwork = true;
  item.system.enh = enhancementBonus;
  
  // 5. Calculate price
  const basePrice = item.system.price || getBasePrice(item);
  const masterworkCost = enhType === 'weapon' ? 300 : 150;
  const enhancementCosts = [0, 2000, 8000, 18000, 32000, 50000, 72000, 98000, 128000, 162000, 200000];
  const enhancementCost = enhancementCosts[totalBonusLevels];
  
  item.system.price = basePrice + masterworkCost + enhancementCost;
  
  // 6. Update name
  const baseName = item.name.replace(/^(.*?)\s*\+\d+$/, '$1'); // Remove existing +X
  item.name = `${namePrefix}${baseName}${nameSuffix} +${enhancementBonus}`;
  item.system.identifiedName = item.name;
  
  return item;
}

// Usage:
await applyEnhancementsFromCompendium(longsword, 3, ['8ymQFRb8BnIsKViV']); // +3 Flaming
```

---

### Option 2: Manual Enhancement Creation (Fallback)
**Pros**:
- No compendium dependency
- Faster execution
- Full control

**Cons**:
- Must maintain enhancement definitions
- Won't get system updates
- More code to maintain

**Implementation**:
```typescript
interface EnhancementDefinition {
  id: string;
  name: string;
  type: 'weapon' | 'armor';
  enhIncrease: number;
  nameExtension: { prefix: string; suffix: string };
  weaponData?: {
    damageRoll: string;
    damageType: string;
    damageTypeId: string;
  };
  damageReduction?: string[][];
  allowedTypes?: string[][];
  attackNotes?: string;
  effectNotes?: string;
}

const WEAPON_SPECIAL_ABILITIES: Record<string, EnhancementDefinition> = {
  flaming: {
    id: '8ymQFRb8BnIsKViV',
    name: 'Flaming',
    type: 'weapon',
    enhIncrease: 1,
    nameExtension: { prefix: 'Flaming', suffix: '' },
    weaponData: {
      damageRoll: '1d6',
      damageType: 'Fire',
      damageTypeId: 'energy-fire'
    }
  },
  keen: {
    id: 'uKZdGJd5jbTp1234',  // Example ID
    name: 'Keen',
    type: 'weapon',
    enhIncrease: 1,
    nameExtension: { prefix: 'Keen', suffix: '' },
    attackNotes: 'Doubles the threat range of the weapon'
  },
  vorpal: {
    id: 'VWpjGsFlQ336aYy0',
    name: 'Vorpal',
    type: 'weapon',
    enhIncrease: 5,
    nameExtension: { prefix: 'Vorpal', suffix: '' },
    allowedTypes: [['weapon'], ['melee'], ['slashing']],
    attackNotes: 'Upon a roll of natural 20 (followed by a successful roll to confirm the critical hit), the weapon severs the opponent\'s head (if it has one) from its body.'
  }
};

const ARMOR_SPECIAL_ABILITIES: Record<string, EnhancementDefinition> = {
  invulnerability: {
    id: 'mTRqWfCH1G5qWVie',
    name: 'Invulnerability',
    type: 'armor',
    enhIncrease: 3,
    nameExtension: { prefix: '', suffix: 'Invulnerability' },
    damageReduction: [['5', 'magic']]
  }
};

function createEnhancementManually(
  item: any,
  enhancementBonus: number,
  specialAbilities: string[] = []
): any {
  
  const enhType = item.type === 'weapon' ? 'weapon' : 'armor';
  const abilities = enhType === 'weapon' ? WEAPON_SPECIAL_ABILITIES : ARMOR_SPECIAL_ABILITIES;
  
  // Create base enhancement
  const baseEnhId = enhType === 'weapon' ? 'Ng5AlRupmkMOgqQi' : 'iOhtLsgtgmt2l9CM';
  
  const baseEnhancement = {
    _id: baseEnhId,
    name: `+1 ${enhType === 'weapon' ? 'Weapon' : 'Armor'} Enhancement`,
    type: 'enhancement',
    img: `systems/D35E/icons/crafting-station/enhancements/enhancement-${enhType}.png`,
    flags: {
      core: {
        sourceId: `Compendium.D35E.enhancements.${baseEnhId}`
      }
    },
    system: {
      enhancementType: enhType,
      enh: enhancementBonus,
      enhIncrease: enhancementBonus,
      enhIsLevel: false,
      enhIncreaseFormula: '@enhancement',
      nameExtension: { prefix: '', suffix: '' },
      properties: {},
      // ... (other required fields from template)
    }
  };
  
  // Initialize enhancements structure
  item.system.enhancements = {
    uses: { value: 0, max: 0, per: null, autoDeductCharges: true, allowMultipleUses: false, commonPool: true },
    automation: { updateName: false, updatePrice: false },
    clFormula: '',
    spellcastingAbility: '',
    items: [baseEnhancement]
  };
  
  // Add special abilities
  let totalBonusLevels = enhancementBonus;
  let namePrefix = '';
  let nameSuffix = '';
  
  for (const abilityKey of specialAbilities) {
    const abilityDef = abilities[abilityKey];
    if (!abilityDef) continue;
    
    totalBonusLevels += abilityDef.enhIncrease;
    
    if (abilityDef.nameExtension.prefix) {
      namePrefix = abilityDef.nameExtension.prefix + ' ' + namePrefix;
    }
    if (abilityDef.nameExtension.suffix) {
      nameSuffix += (nameSuffix ? ', ' : ' of ') + abilityDef.nameExtension.suffix;
    }
    
    const specialAbility = {
      _id: abilityDef.id,
      name: abilityDef.name,
      type: 'enhancement',
      img: `systems/D35E/icons/crafting-station/enhancements/${enhType}s/${abilityKey}.png`,
      flags: {
        core: {
          sourceId: `Compendium.D35E.enhancements.${abilityDef.id}`
        }
      },
      system: {
        enhancementType: enhType,
        enh: 0,
        enhIncrease: abilityDef.enhIncrease,
        enhIsLevel: true,
        enhIncreaseFormula: String(abilityDef.enhIncrease),
        nameExtension: abilityDef.nameExtension,
        weaponData: abilityDef.weaponData || {},
        damageReduction: abilityDef.damageReduction || [],
        allowedTypes: abilityDef.allowedTypes || [],
        attackNotes: abilityDef.attackNotes || '',
        effectNotes: abilityDef.effectNotes || '',
        properties: {},
        // ... (other required fields)
      }
    };
    
    item.system.enhancements.items.push(specialAbility);
  }
  
  // Update item properties
  item.system.masterwork = true;
  item.system.enh = enhancementBonus;
  
  // Calculate price
  const basePrice = item.system.unidentified?.price || item.system.price || 0;
  const masterworkCost = enhType === 'weapon' ? 300 : 150;
  const enhancementCosts = [0, 2000, 8000, 18000, 32000, 50000, 72000, 98000, 128000, 162000, 200000];
  const enhancementCost = enhancementCosts[Math.min(totalBonusLevels, 10)];
  
  item.system.price = basePrice + masterworkCost + enhancementCost;
  
  // Update name
  const baseName = item.name.replace(/^(.*?)\s*\+\d+$/, '$1').trim();
  item.name = `${namePrefix}${baseName}${nameSuffix} +${enhancementBonus}`.trim();
  item.system.identifiedName = item.name;
  
  return item;
}

// Usage:
createEnhancementManually(longsword, 3, ['flaming']); // Flaming Longsword +3
```

---

## Enhancement Bonus Level Costs

| Total Levels | Cost (gp) | Example |
|-------------|----------|---------|
| +1 | 2,000 | +1 weapon/armor |
| +2 | 8,000 | +2 or +1 Flaming |
| +3 | 18,000 | +3 or +2 Flaming |
| +4 | 32,000 | +4 or +3 Flaming or +2 Keen Flaming |
| +5 | 50,000 | +5 or +4 Flaming |
| +6 | 72,000 | +5 Flaming or +3 Keen Flaming Shock |
| +7 | 98,000 | +5 Flaming Shock |
| +8 | 128,000 | +5 Holy Flaming Shock |
| +9 | 162,000 | +5 Holy Flaming Icy Burst Shock |
| +10 | 200,000 | +5 Vorpal or max special abilities |

**Important**: Maximum total bonus levels = +10 (per SRD rules)

---

## Common Special Abilities Quick Reference

### Weapon Abilities (from SRD)
- **Flaming** (+1): +1d6 fire damage
- **Frost** (+1): +1d6 cold damage  
- **Shock** (+1): +1d6 electricity damage
- **Keen** (+1): Doubles threat range (19-20 becomes 17-20)
- **Holy** (+2): +2d6 vs evil
- **Unholy** (+2): +2d6 vs good
- **Bane** (+1): +2 enhancement, +2d6 damage vs specific creature type
- **Vorpal** (+5): Natural 20 + confirm = decapitation (slashing only)

### Armor Abilities (from SRD)
- **Invulnerability** (+3): DR 5/magic
- **Shadow** (+1): +5 competence bonus to Hide checks
- **Slick** (+1): +5 competence bonus to Escape Artist checks
- **Spell Resistance 13** (+2): SR 13
- **Spell Resistance 15** (+3): SR 15
- **Spell Resistance 17** (+4): SR 17
- **Spell Resistance 19** (+5): SR 19

---

## Critical Implementation Notes

### 1. Masterwork is MANDATORY
```typescript
// Always set for any magic item
item.system.masterwork = true;
```

### 2. Enhancement Automation is DISABLED
```typescript
// System won't auto-update, you must do it manually
item.system.enhancements.automation = {
  updateName: false,
  updatePrice: false
};
```

### 3. Name Format Matters
```json
{
  "weapon": "Prefix BaseName Suffix +Bonus",
  "armor": "BaseName of Suffix +Bonus",
  "examples": [
    "Flaming Longsword +3",
    "Keen Vorpal Greatsword +5",
    "Scale Mail of Invulnerability +3",
    "Plate Armor of Speed +4"
  ]
}
```

### 4. Price Calculation Order
```typescript
const totalPrice = 
  baseItemPrice +              // From SRD (e.g., Longsword = 15 gp)
  masterworkCost +             // Weapon: 300 gp, Armor: 150 gp
  enhancementCost;             // Based on TOTAL bonus levels

// Example: Flaming Longsword +3
// = 15 (base) + 300 (mw) + 32000 (+4 levels) = 32,315 gp
```

### 5. Enhancement Array Order
```typescript
// First item is ALWAYS base enhancement (+1/+2/+3/+4/+5)
enhancements.items[0] = baseEnhancement;

// Subsequent items are special abilities
enhancements.items[1] = flamingAbility;
enhancements.items[2] = keenAbility;
// etc.
```

---

## Recommended Approach for Townie Maker

**Phase 1: Simple Enhancements Only (MVP)**
- Implement +1 through +5 weapon/armor enhancements
- No special abilities initially
- Use manual creation (Option 2) for speed

**Phase 2: Common Special Abilities**
- Add Flaming, Frost, Shock, Keen for weapons
- Add Invulnerability, Shadow, Slick for armor
- Still manual creation with hardcoded definitions

**Phase 3: Full Compendium Integration**
- Switch to Option 1 (compendium-based)
- Access all available enhancements
- Allow random selection based on item type

**Phase 4: Smart Selection Algorithm**
- Match enhancements to character class/role
- Flaming for fire-themed characters
- Keen for crit-focused builds
- Invulnerability for tanks
- Budget-aware (don't exceed total +10 limit)

---

## Testing Checklist

- [ ] Base enhancement sets `masterwork: true`
- [ ] Price calculation includes base + masterwork + enhancement
- [ ] Name updates with +X suffix
- [ ] Special abilities add to total bonus levels correctly
- [ ] Special abilities use correct prefix/suffix formatting
- [ ] Multiple special abilities stack bonus levels
- [ ] Total bonus levels don't exceed +10
- [ ] Weapon special abilities only on weapons
- [ ] Armor special abilities only on armor
- [ ] Restricted abilities check allowed types (e.g., Vorpal on slashing only)
- [ ] Enhancement data structure matches D35E system format
- [ ] Items sort into containers correctly after enhancement
- [ ] Enhanced items display correctly in character sheet
- [ ] Enhancements affect combat rolls properly

---

## Example Output

```typescript
// Input: mundane longsword
const longsword = {
  name: "Longsword",
  type: "weapon",
  system: {
    price: 15,
    masterwork: false,
    // ... other fields
  }
};

// Apply enhancement
createEnhancementManually(longsword, 3, ['flaming']);

// Output:
{
  name: "Flaming Longsword +3",
  type: "weapon",
  system: {
    price: 32315,              // 15 + 300 + 32000
    masterwork: true,
    enh: 3,
    identifiedName: "Flaming Longsword +3",
    enhancements: {
      automation: { updateName: false, updatePrice: false },
      items: [
        { /* +1 Weapon Enhancement with enh: 3 */ },
        { /* Flaming with enhIncrease: 1 */ }
      ]
    }
  }
}
```
