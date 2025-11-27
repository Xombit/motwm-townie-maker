# Simple Magic Items for Implementation
## D35E System Compatible - SRD Verified

This document lists **SIMPLE** magic items that can be implemented without complex continuous spell effects. The d35e system doesn't have pre-built continuous-effect items like "Ring of Freedom of Movement" - you have to create them yourself using the crafting system.

For our townie-maker module, we're focusing on items that are straightforward **flat bonuses** that don't require custom spell effect implementation.

---

## Implementation Philosophy

**PHASE 1 - Core Enhancement Items (Simple):**
- ✅ Enhancement bonuses (+1 to +5 weapons/armor) - these are enchantments placed ON mundane items
- ✅ Stat increases (+2/+4/+6 to abilities)
- ✅ Resistance bonuses (saves)
- ✅ Deflection bonuses (AC)
- ✅ Natural armor bonuses (AC)
- ✅ Basic utility (storage items)

**PHASE 2 - SRD Continuous-Effect Items (If Budget Allows):**
- ✅ SRD items with continuous spell effects (Ring of Freedom of Movement, Cloaks of Displacement, etc.)
- ✅ Flight items (Broom of Flying, Carpet of Flying, Wings of Flying)
- ✅ Other SRD wondrous items (if character has budget after Big Six)
- **Implementation**: Just set name and price - no spell attachment needed if item exists in d35e system

**Priority Order:**
1. Weapon/Armor enhancements (enchantments on mundane items)
2. Wondrous items for stat/saves/AC boosts (Big Six accessories)
3. SRD utility items (storage, situational items)
4. SRD continuous-effect items (if budget remains)

**Note on Continuous Effect Items**: 
- If an item is on the SRD web list, it should be in the d35e system
- We can create these using the magic item creation formula: `spell level × caster level × 2,000 gp` (continuous) or `× 1,800 gp` (command word)
- We don't need to attach spells - just set the name and price from SRD

---

## The "Big Six" - Core Priority Items

These are universally recommended for all characters and should be the foundation of our implementation.

### 1. Weapon Enhancement
**Purpose**: Attack and damage bonuses
**SRD Reference**: Magic Weapons section
```
+1 Weapon:  2,000 gp  (Level 3+)
+2 Weapon:  8,000 gp  (Level 6+)
+3 Weapon: 18,000 gp  (Level 10+)
+4 Weapon: 32,000 gp  (Level 13+)
+5 Weapon: 50,000 gp  (Level 15+)
```
**Implementation**: Simple numeric bonus to attack rolls and damage rolls

### 2. Armor Enhancement
**Purpose**: AC bonus
**SRD Reference**: Magic Armor section
```
+1 Armor:  1,000 gp  (Level 3+)
+2 Armor:  4,000 gp  (Level 5+)
+3 Armor:  9,000 gp  (Level 8+)
+4 Armor: 16,000 gp  (Level 11+)
+5 Armor: 25,000 gp  (Level 13+)
```
**Implementation**: Simple numeric bonus to AC

### 3. Cloak of Resistance
**Purpose**: All saving throws
**SRD Reference**: Wondrous Items - Cloak of Resistance
```
+1: 1,000 gp    (Level 2+)
+2: 4,000 gp    (Level 5+)
+3: 9,000 gp    (Level 8+)
+4: 16,000 gp   (Level 11+)
+5: 25,000 gp   (Level 13+)
```
**Implementation**: Resistance bonus to Fort/Ref/Will saves

### 4. Ring of Protection
**Purpose**: Deflection bonus to AC
**SRD Reference**: Rings - Ring of Protection
```
+1:  2,000 gp   (Level 4+)
+2:  8,000 gp   (Level 6+)
+3: 18,000 gp   (Level 10+)
+4: 32,000 gp   (Level 13+)
+5: 50,000 gp   (Level 15+)
```
**Implementation**: Deflection bonus to AC

### 5. Amulet of Natural Armor
**Purpose**: Natural armor bonus to AC
**SRD Reference**: Wondrous Items - Amulet of Natural Armor
```
+1:  2,000 gp   (Level 4+)
+2:  8,000 gp   (Level 6+)
+3: 18,000 gp   (Level 10+)
+4: 32,000 gp   (Level 13+)
+5: 50,000 gp   (Level 15+)
```
**Implementation**: Natural armor bonus to AC

### 6. Ability Score Boosters
**Purpose**: Increase primary ability score(s)
**SRD Reference**: Wondrous Items (various)

**Strength** - Belt of Giant Strength:
```
+4: 16,000 gp   (Level 10+)
+6: 36,000 gp   (Level 14+)
```

**Dexterity** - Gloves of Dexterity:
```
+2:  4,000 gp   (Level 5+)
+4: 16,000 gp   (Level 10+)
+6: 36,000 gp   (Level 14+)
```

**Constitution** - Amulet of Health:
```
+2:  4,000 gp   (Level 5+)
+4: 16,000 gp   (Level 10+)
+6: 36,000 gp   (Level 14+)
```

**Intelligence** - Headband of Intellect:
```
+2:  4,000 gp   (Level 5+)
+4: 16,000 gp   (Level 10+)
+6: 36,000 gp   (Level 14+)
```

**Wisdom** - Periapt of Wisdom:
```
+2:  4,000 gp   (Level 5+)
+4: 16,000 gp   (Level 10+)
+6: 36,000 gp   (Level 14+)
```

**Charisma** - Cloak of Charisma:
```
+2:  4,000 gp   (Level 5+)
+4: 16,000 gp   (Level 10+)
+6: 36,000 gp   (Level 14+)
```

**Implementation**: Enhancement bonus to ability score

---

## Utility Items (Simple Storage)

These are quality-of-life improvements that don't affect combat.

### Handy Haversack
**Cost**: 2,000 gp (Level 3+)
**Purpose**: Quick item retrieval (move action, no AoO)
**SRD Reference**: Wondrous Items - Handy Haversack
**Implementation**: Descriptive only - no mechanical implementation needed for townie generation

### Bag of Holding
**Cost**: 2,500 - 10,000 gp depending on type
**Purpose**: Carry capacity
**SRD Reference**: Wondrous Items - Bag of Holding
```
Type I:   2,500 gp (250 lb)
Type II:  5,000 gp (500 lb)
Type III: 7,400 gp (1,000 lb)
Type IV: 10,000 gp (1,500 lb)
```
**Implementation**: Descriptive only

### Efficient Quiver
**Cost**: 1,800 gp
**Purpose**: Arrow/weapon storage with quick access
**SRD Reference**: Wondrous Items - Efficient Quiver
**Implementation**: Descriptive only (mainly for archers)

---

## Phase 2: SRD Continuous-Effect Items

These items ARE in the d35e system (verified on SRD). Include them if the character has budget remaining after the Big Six.

### Freedom of Movement
**Ring of Freedom of Movement**: 40,000 gp (Level 15+)
- Continuous freedom of movement spell effect
- **Formula**: Spell level 4 × caster level 7 × 2,000 gp = 56,000 gp (SRD lists at 40,000 gp)
- **SRD Confirmed**: Available in d35e system

### Displacement/Miss Chance
**Cloak of Displacement, Minor**: 24,000 gp (Level 12+)
- Continuous 20% miss chance
- **SRD Confirmed**: Available in d35e system

**Cloak of Displacement, Major**: 50,000 gp (Level 15+)
- 50% miss chance (displacement spell) for 15 rounds/day
- **SRD Confirmed**: Available in d35e system

**Ring of Blinking**: 27,000 gp (Level 13+)
- Blink effect on command
- **SRD Confirmed**: Available in d35e system

### Flight Items
**Broom of Flying**: 17,000 gp (Level 10+)
- 40 ft speed, 9 hours/day (overland flight effect)
- **Formula**: Spell level 5 × caster level 9 × 2,000 gp ÷ 5 (limited duration) = 18,000 gp (SRD: 17,000 gp)

**Carpet of Flying (5x5 ft)**: 20,000 gp (Level 11+)
- All-day flight at 40 ft speed
- **Formula**: Spell level 5 × caster level 10 × 2,000 gp ÷ 5 = 20,000 gp

**Wings of Flying**: 54,000 gp (Level 16+)
- True permaflight, 60 ft speed, good maneuverability
- **Formula**: Spell level 5 × caster level 10 × 2,000 gp (continuous) = 100,000 gp (SRD reduced price)

**Boots, Winged**: 16,000 gp (Level 10+)
- Fly spell 3/day for 5 minutes each
- **Formula**: Spell level 3 × caster level 5 × 1,800 gp ÷ (5/3) = 16,200 gp

### Other Utility
**Eversmoking Bottle**: 5,400 gp (Level 6+)
- Creates obscuring mist at will
- **Formula**: Spell level 1 × caster level 3 × 2,000 gp ÷ 2 (charges out) = 3,000 gp (SRD: 5,400 gp)

**Handy Haversack**: 2,000 gp (Level 3+)
- Quick item retrieval (move action, no AoO)
- **Implementation**: Descriptive utility, no mechanical bonus

**Bag of Holding (Type I-IV)**: 2,500-10,000 gp
- Carry capacity increase
- **Implementation**: Descriptive utility

---

## Items We're NOT Implementing (Not in SRD or Too Niche)

### Missing from SRD
- ❌ Belt of Battle - Not in SRD (initiative/action economy)
- ❌ Warning weapon enhancement - Not in SRD
- ❌ Blindsight/Tremorsense items - None exist in SRD
- ❌ Low-level dimension door items - Too expensive (49,000+ gp for useful versions)

### Why Skip These?
These items either don't exist in the SRD or require DM custom item creation using the crafting formula.

---

## Recommended Purchase Progression by Level

### Tier 1: Levels 1-5 (Starting Wealth: 900 - 13,000 gp)

**Level 3** (2,600 gp available):
1. +1 Weapon (2,000 gp) - PRIMARY PRIORITY
2. Cloak of Resistance +1 (1,000 gp) - if any budget remains

**Level 4** (5,600 gp available):
1. +1 Weapon (2,000 gp)
2. +1 Armor (1,000 gp)
3. Cloak of Resistance +1 (1,000 gp)
4. Handy Haversack (2,000 gp) OR +2 Primary Stat (4,000 gp if enough)

**Level 5** (9,000 gp available):
1. +1 Weapon (2,000 gp)
2. +1 Armor (1,000 gp)
3. +2 Primary Stat (4,000 gp)
4. Cloak of Resistance +1 (1,000 gp)
5. Handy Haversack (2,000 gp) - if budget remains

### Tier 2: Levels 6-10 (Starting Wealth: 16,000 - 62,000 gp)

**Level 6** (16,000 gp available):
1. +1 Weapon (2,000 gp)
2. +1 Armor (1,000 gp)
3. +2 Primary Stat (4,000 gp)
4. Cloak of Resistance +2 (4,000 gp)
5. Ring of Protection +1 (2,000 gp)
6. Handy Haversack (2,000 gp)
**Total**: 15,000 gp

**Level 8** (33,000 gp available):
1. +2 Weapon (8,000 gp)
2. +2 Armor (4,000 gp)
3. +4 Primary Stat (16,000 gp)
4. Cloak of Resistance +2 (4,000 gp)
5. Ring of Protection +1 (2,000 gp)
6. Handy Haversack (2,000 gp)
**Total**: 36,000 gp - **slightly over budget, adjust as needed**

**Level 10** (62,000 gp available):
1. +3 Weapon (18,000 gp)
2. +2 Armor (4,000 gp)
3. +4 Primary Stat (16,000 gp)
4. Cloak of Resistance +3 (9,000 gp)
5. Ring of Protection +2 (8,000 gp)
6. Amulet of Natural Armor +1 (2,000 gp)
7. +2 Secondary Stat (4,000 gp)
8. Handy Haversack (2,000 gp)
**Total**: 63,000 gp - **slightly over, adjust priorities**

### Tier 3: Levels 11-15 (Starting Wealth: 82,000 - 200,000 gp)

**Level 11** (82,000 gp available):
1. +3 Weapon (18,000 gp)
2. +3 Armor (9,000 gp)
3. +4 Primary Stat (16,000 gp)
4. Cloak of Resistance +4 (16,000 gp)
5. Ring of Protection +2 (8,000 gp)
6. Amulet of Natural Armor +2 (8,000 gp)
7. +2 Secondary Stat (4,000 gp)
8. Handy Haversack (2,000 gp)
**Total**: 81,000 gp

**Level 13** (140,000 gp available):
1. +4 Weapon (32,000 gp)
2. +4 Armor (16,000 gp)
3. +6 Primary Stat (36,000 gp)
4. Cloak of Resistance +4 (16,000 gp)
5. Ring of Protection +3 (18,000 gp)
6. Amulet of Natural Armor +3 (18,000 gp)
7. +2 Secondary Stat (4,000 gp)
8. Handy Haversack (2,000 gp)
**Total**: 142,000 gp - **slightly over**

**Level 15** (200,000 gp available):
1. +5 Weapon (50,000 gp)
2. +4 Armor (16,000 gp)
3. +6 Primary Stat (36,000 gp)
4. Cloak of Resistance +5 (25,000 gp)
5. Ring of Protection +4 (32,000 gp)
6. Amulet of Natural Armor +3 (18,000 gp)
7. +4 Secondary Stat (16,000 gp)
8. Handy Haversack (2,000 gp)
**Total**: 195,000 gp

### Tier 4: Levels 16-20 (Starting Wealth: 260,000 - 760,000 gp)

**Level 17** (410,000 gp available):
1. +5 Weapon (50,000 gp)
2. +5 Armor (25,000 gp)
3. +6 Primary Stat (36,000 gp)
4. Cloak of Resistance +5 (25,000 gp)
5. Ring of Protection +5 (50,000 gp)
6. Amulet of Natural Armor +5 (50,000 gp)
7. +6 Secondary Stat (36,000 gp)
8. +4 Tertiary Stat (16,000 gp)
9. Handy Haversack (2,000 gp)
**Total**: 290,000 gp

**Level 20** (760,000 gp available):
1. +5 Weapon (50,000 gp)
2. +5 Armor (25,000 gp)
3. +6 Primary Stat (36,000 gp)
4. Cloak of Resistance +5 (25,000 gp)
5. Ring of Protection +5 (50,000 gp)
6. Amulet of Natural Armor +5 (50,000 gp)
7. +6 Secondary Stat (36,000 gp)
8. +6 Tertiary Stat (36,000 gp)
9. Handy Haversack (2,000 gp)
**Total**: 308,000 gp - **Leaves 452,000 gp for special items!**

---

## Implementation Priority Order

When building the selection algorithm, use this priority order:

### Phase 1: Big Six (Always prioritize these)
1. **Weapon Enhancement** - Directly improves attack effectiveness
2. **Armor Enhancement** - AC improvement
3. **Primary Stat Booster** - Core ability for the character class
4. **Cloak of Resistance** - All saves
5. **Ring of Protection** - AC (deflection)
6. **Amulet of Natural Armor** - AC (natural)

### Phase 2: Wondrous Items (After Big Six core is established)
7. **Secondary Stat Booster** - Supporting ability
8. **Tertiary Stat Booster** - Nice to have at high levels

### Phase 3: Utility Items (If budget remains)
9. **Storage** - Handy Haversack, Bag of Holding (quality of life)
10. **Situational SRD Items** - Flight, displacement, freedom of movement (if affordable)

### Budget Allocation Philosophy
- **60-70%** of wealth should go to Big Six enhancements
- **20-30%** can go to secondary stats and utility
- **10%** for situational/luxury items (flight, displacement, etc.)

---

## Data Structure for Implementation

```typescript
interface SimpleMagicItem {
  name: string;
  cost: number;
  bonusType: 'enhancement' | 'resistance' | 'deflection' | 'natural' | 'ability' | 'continuous-effect';
  bonusValue?: number; // For numeric bonuses
  slot: 'weapon' | 'armor' | 'shoulders' | 'ring' | 'neck' | 'head' | 'hands' | 'waist' | 'body' | 'feet';
  appliesTo?: 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha' | 'saves' | 'ac' | 'special';
  minLevel: number; // Recommended minimum character level
  priority: 'big-six' | 'secondary' | 'utility' | 'situational';
  isEnchantment?: boolean; // True if this is an enchantment placed ON a mundane item (weapon/armor)
  isContinuousEffect?: boolean; // True if this requires spell effect (but item exists in system)
}

const BIG_SIX_ITEMS: SimpleMagicItem[] = [
  // Weapons +1 to +5 (enchantments placed ON mundane weapons)
  { name: '+1 Weapon', cost: 2000, bonusType: 'enhancement', bonusValue: 1, slot: 'weapon', minLevel: 3, priority: 'big-six', isEnchantment: true },
  { name: '+2 Weapon', cost: 8000, bonusType: 'enhancement', bonusValue: 2, slot: 'weapon', minLevel: 6, priority: 'big-six', isEnchantment: true },
  { name: '+3 Weapon', cost: 18000, bonusType: 'enhancement', bonusValue: 3, slot: 'weapon', minLevel: 10, priority: 'big-six', isEnchantment: true },
  { name: '+4 Weapon', cost: 32000, bonusType: 'enhancement', bonusValue: 4, slot: 'weapon', minLevel: 13, priority: 'big-six', isEnchantment: true },
  { name: '+5 Weapon', cost: 50000, bonusType: 'enhancement', bonusValue: 5, slot: 'weapon', minLevel: 15, priority: 'big-six', isEnchantment: true },
  
  // Armor +1 to +5 (enchantments placed ON mundane armor)
  { name: '+1 Armor', cost: 1000, bonusType: 'enhancement', bonusValue: 1, slot: 'armor', minLevel: 3, priority: 'big-six', isEnchantment: true },
  { name: '+2 Armor', cost: 4000, bonusType: 'enhancement', bonusValue: 2, slot: 'armor', minLevel: 5, priority: 'big-six', isEnchantment: true },
  { name: '+3 Armor', cost: 9000, bonusType: 'enhancement', bonusValue: 3, slot: 'armor', minLevel: 8, priority: 'big-six', isEnchantment: true },
  { name: '+4 Armor', cost: 16000, bonusType: 'enhancement', bonusValue: 4, slot: 'armor', minLevel: 11, priority: 'big-six', isEnchantment: true },
  { name: '+5 Armor', cost: 25000, bonusType: 'enhancement', bonusValue: 5, slot: 'armor', minLevel: 13, priority: 'big-six', isEnchantment: true },
  
  // Cloak of Resistance
  { name: 'Cloak of Resistance +1', cost: 1000, bonusType: 'resistance', bonusValue: 1, slot: 'shoulders', appliesTo: 'saves', minLevel: 2, priority: 'big-six' },
  { name: 'Cloak of Resistance +2', cost: 4000, bonusType: 'resistance', bonusValue: 2, slot: 'shoulders', appliesTo: 'saves', minLevel: 5, priority: 'big-six' },
  { name: 'Cloak of Resistance +3', cost: 9000, bonusType: 'resistance', bonusValue: 3, slot: 'shoulders', appliesTo: 'saves', minLevel: 8, priority: 'big-six' },
  { name: 'Cloak of Resistance +4', cost: 16000, bonusType: 'resistance', bonusValue: 4, slot: 'shoulders', appliesTo: 'saves', minLevel: 11, priority: 'big-six' },
  { name: 'Cloak of Resistance +5', cost: 25000, bonusType: 'resistance', bonusValue: 5, slot: 'shoulders', appliesTo: 'saves', minLevel: 13, priority: 'big-six' },
  
  // Ring of Protection
  { name: 'Ring of Protection +1', cost: 2000, bonusType: 'deflection', bonusValue: 1, slot: 'ring', appliesTo: 'ac', minLevel: 4, priority: 'big-six' },
  { name: 'Ring of Protection +2', cost: 8000, bonusType: 'deflection', bonusValue: 2, slot: 'ring', appliesTo: 'ac', minLevel: 6, priority: 'big-six' },
  { name: 'Ring of Protection +3', cost: 18000, bonusType: 'deflection', bonusValue: 3, slot: 'ring', appliesTo: 'ac', minLevel: 10, priority: 'big-six' },
  { name: 'Ring of Protection +4', cost: 32000, bonusType: 'deflection', bonusValue: 4, slot: 'ring', appliesTo: 'ac', minLevel: 13, priority: 'big-six' },
  { name: 'Ring of Protection +5', cost: 50000, bonusType: 'deflection', bonusValue: 5, slot: 'ring', appliesTo: 'ac', minLevel: 15, priority: 'big-six' },
  
  // Amulet of Natural Armor
  { name: 'Amulet of Natural Armor +1', cost: 2000, bonusType: 'natural', bonusValue: 1, slot: 'neck', appliesTo: 'ac', minLevel: 4, priority: 'big-six' },
  { name: 'Amulet of Natural Armor +2', cost: 8000, bonusType: 'natural', bonusValue: 2, slot: 'neck', appliesTo: 'ac', minLevel: 6, priority: 'big-six' },
  { name: 'Amulet of Natural Armor +3', cost: 18000, bonusType: 'natural', bonusValue: 3, slot: 'neck', appliesTo: 'ac', minLevel: 10, priority: 'big-six' },
  { name: 'Amulet of Natural Armor +4', cost: 32000, bonusType: 'natural', bonusValue: 4, slot: 'neck', appliesTo: 'ac', minLevel: 13, priority: 'big-six' },
  { name: 'Amulet of Natural Armor +5', cost: 50000, bonusType: 'natural', bonusValue: 5, slot: 'neck', appliesTo: 'ac', minLevel: 15, priority: 'big-six' },
  
  // Stat boosters - all six abilities
  { name: 'Gloves of Dexterity +2', cost: 4000, bonusType: 'ability', bonusValue: 2, slot: 'hands', appliesTo: 'dex', minLevel: 5, priority: 'big-six' },
  { name: 'Gloves of Dexterity +4', cost: 16000, bonusType: 'ability', bonusValue: 4, slot: 'hands', appliesTo: 'dex', minLevel: 10, priority: 'big-six' },
  { name: 'Gloves of Dexterity +6', cost: 36000, bonusType: 'ability', bonusValue: 6, slot: 'hands', appliesTo: 'dex', minLevel: 14, priority: 'big-six' },
  
  // ... repeat for str (belt), con (amulet), int (headband), wis (periapt), cha (cloak)
];

const CONTINUOUS_EFFECT_ITEMS: SimpleMagicItem[] = [
  // Flight
  { name: 'Broom of Flying', cost: 17000, bonusType: 'continuous-effect', slot: 'body', appliesTo: 'special', minLevel: 10, priority: 'situational', isContinuousEffect: true },
  { name: 'Carpet of Flying (5x5 ft)', cost: 20000, bonusType: 'continuous-effect', slot: 'body', appliesTo: 'special', minLevel: 11, priority: 'situational', isContinuousEffect: true },
  { name: 'Wings of Flying', cost: 54000, bonusType: 'continuous-effect', slot: 'shoulders', appliesTo: 'special', minLevel: 16, priority: 'situational', isContinuousEffect: true },
  { name: 'Boots, Winged', cost: 16000, bonusType: 'continuous-effect', slot: 'feet', appliesTo: 'special', minLevel: 10, priority: 'situational', isContinuousEffect: true },
  
  // Freedom of Movement
  { name: 'Ring of Freedom of Movement', cost: 40000, bonusType: 'continuous-effect', slot: 'ring', appliesTo: 'special', minLevel: 15, priority: 'situational', isContinuousEffect: true },
  
  // Displacement/Miss Chance
  { name: 'Cloak of Displacement, Minor', cost: 24000, bonusType: 'continuous-effect', slot: 'shoulders', appliesTo: 'special', minLevel: 12, priority: 'situational', isContinuousEffect: true },
  { name: 'Cloak of Displacement, Major', cost: 50000, bonusType: 'continuous-effect', slot: 'shoulders', appliesTo: 'special', minLevel: 15, priority: 'situational', isContinuousEffect: true },
  { name: 'Ring of Blinking', cost: 27000, bonusType: 'continuous-effect', slot: 'ring', appliesTo: 'special', minLevel: 13, priority: 'situational', isContinuousEffect: true },
  
  // Utility
  { name: 'Handy Haversack', cost: 2000, bonusType: 'continuous-effect', slot: 'body', appliesTo: 'special', minLevel: 3, priority: 'utility', isContinuousEffect: false },
  { name: 'Bag of Holding (Type I)', cost: 2500, bonusType: 'continuous-effect', slot: 'body', appliesTo: 'special', minLevel: 3, priority: 'utility', isContinuousEffect: false },
  { name: 'Eversmoking Bottle', cost: 5400, bonusType: 'continuous-effect', slot: 'body', appliesTo: 'special', minLevel: 6, priority: 'situational', isContinuousEffect: true },
];
```

---

## Magic Item Creation Formula (For Reference)

If we need to price items not explicitly listed in SRD, use these formulas:

### Use-Activated or Continuous Items
```
Spell level × caster level × 2,000 gp
```
**Example**: Ring of Freedom of Movement
- Spell level: 4 (freedom of movement)
- Caster level: 7 (minimum)
- Formula: 4 × 7 × 2,000 = 56,000 gp
- **SRD lists at 40,000 gp** (adjusted down for balance)

### Command Word Items
```
Spell level × caster level × 1,800 gp
```
**Example**: Ring of Blinking (on command)
- Spell level: 3 (blink)
- Caster level: 10
- Formula: 3 × 10 × 1,800 = 54,000 gp
- **SRD lists at 27,000 gp** (adjusted for limited use)

### Charges Per Day
```
Spell level × caster level × 2,000 gp × (charges per day / 5) ÷ (5 / charges per day)
```
This gets complex - refer to SRD prices directly for these items.

### Important Note
**We don't need to attach spells to items** - if the item exists in the d35e system (which it does for SRD items), we just need to set the name and price. The system already has the mechanics built in.

---

## Implementation Notes

### For Weapon/Armor Enhancements
These are **enchantments placed ON existing mundane items**, not standalone items:
1. Character already has mundane weapon/armor from starting kit
2. We apply +1/+2/+3/+4/+5 enchantment to that item
3. Cost is just the enchantment cost (weapon base cost already paid)

### For Wondrous Items
These are **complete standalone items**:
1. Purchase directly from compendium
2. Set name and price from SRD
3. No need to implement spell effects if item exists in system

### Budget After Mundane Equipment
```typescript
// Example calculation
const characterLevel = 10;
const totalWealth = 62000; // gp from wealth by level table
const mundaneEquipmentCost = 5000; // from starting kit
const magicItemBudget = totalWealth - mundaneEquipmentCost; // 57,000 gp

// Allocate budget
const bigSixBudget = magicItemBudget * 0.70; // 39,900 gp
const secondaryBudget = magicItemBudget * 0.20; // 11,400 gp
const utilityBudget = magicItemBudget * 0.10; // 5,700 gp
```

---

## Next Steps for Implementation

1. **Create comprehensive item database** with all SRD items (Big Six + continuous effects)
2. **Implement selection algorithm** that prioritizes weapon/armor → stats/saves/AC → utility → situational
3. **Handle enchantments vs standalone items** - enchantments modify existing equipment, wondrous items are new
4. **Test with various character builds** at different levels to ensure budget is well-spent
