# Implementation Plan - D35E Actor Creation

## Based on Research from D35E_STRUCTURE.md

---

## 🎯 **Current Status: Research Complete!**

We now have complete knowledge of:
- ✅ D35E compendium structure
- ✅ Race item format (`D35E.racialfeatures`)
- ✅ Class item format (`D35E.classes`)
- ✅ Sample actor structure (`D35E.sample-chars`)
- ✅ How to access compendiums via API

---

## 📊 **Key Findings**

### Race Items (`type: "race"`)
```javascript
{
  type: "race",
  system: {
    changes: [
      ["2", "ability", "cha", "racial"],    // +2 CHA
      ["-2", "ability", "str", "racial"]    // -2 STR
    ],
    creatureType: "monstrousHumanoid",
    la: 1,  // Level Adjustment
    subTypes: [["Psionic"]],
    addedAbilities: [...]  // Racial features
  }
}
```

### Class Items (`type: "class"`)
```javascript
{
  type: "class",
  system: {
    levels: 0,           // Set this when adding to actor
    hd: 8,               // Hit die (d8)
    bab: "high",         // "high", "medium", "low"
    skillsPerLevel: 2,
    savingThrows: {
      fort: { value: "high" },
      ref: { value: "low" },
      will: { value: "low" }
    },
    classSkills: {...}   // Which skills are class skills
  }
}
```

### Actor Structure
```javascript
{
  name: "Character Name",
  type: "character",
  system: {
    abilities: {
      str: { value: 10, total: 10, mod: 0 },
      dex: { value: 10, total: 10, mod: 0 },
      // ... etc
    },
    attributes: {
      hp: { value: 8, max: 8 },
      // ... AC, saves, BAB calculated by system
    }
  },
  items: [...]  // Embedded race, class, feat, equipment items
}
```

---

## 🔨 **Implementation Steps**

### Phase 1: Core Item Addition (DO THIS FIRST)

#### 1.1: Improve getRaces() and getClasses()
**File:** `src/d35e-adapter.ts`

Current implementation works but needs caching and better error handling.

```typescript
static async getRaces(): Promise<Array<{ id: string; name: string }>> {
  // Current code is OK, just add caching
  // Pack ID: 'D35E.racialfeatures'
  // Filter by: type === "race"
}

static async getClasses(): Promise<Array<{ id: string; name: string }>> {
  // Current code is OK, just add caching
  // Pack ID: 'D35E.classes'
  // Filter by: type === "class"
}
```

#### 1.2: Implement addRace()
**New method in `d35e-adapter.ts`**

```typescript
static async addRace(actor: Actor, raceName: string): Promise<void> {
  // 1. Get race compendium
  const pack = game.packs.get('D35E.racialfeatures');
  
  // 2. Find race by name
  const index = await pack.getIndex();
  const raceEntry = index.find(i => i.name === raceName);
  
  // 3. Get full race document
  const raceDoc = await pack.getDocument(raceEntry._id);
  
  // 4. Add to actor
  await actor.createEmbeddedDocuments('Item', [raceDoc.toObject()]);
  
  // Note: D35E system should auto-apply racial modifiers!
}
```

#### 1.3: Implement addClass()
**Replace stub in `d35e-adapter.ts`**

```typescript
static async addClass(actor: Actor, className: string, level: number): Promise<void> {
  // 1. Get class compendium
  const pack = game.packs.get('D35E.classes');
  
  // 2. Find class by name
  const index = await pack.getIndex();
  const classEntry = index.find(i => i.name === className);
  
  // 3. Get full class document
  const classDoc = await pack.getDocument(classEntry._id);
  
  // 4. Add to actor (DON'T modify levels!)
  const classData = classDoc.toObject();
  await actor.createEmbeddedDocuments('Item', [classData]);
  
  // 5. Set actor level (D35E auto-syncs class levels)
  await actor.update({
    "system.attributes.level.value": level
  });
  
  // Note: D35E system auto-calculates BAB, saves, skills!
}
```

**⚠️ CRITICAL INSIGHT FROM TESTING:**
- DO NOT set `classData.system.levels` directly
- D35E manages class levels automatically based on actor level
- Set `system.attributes.level.value` and D35E handles the rest

#### 1.4: Implement rollHP()
**Replace stub in `d35e-adapter.ts`**

```typescript
static async rollHP(actor: Actor): Promise<void> {
  // Get all class items from actor
  const classes = actor.items.filter(i => i.type === "class");
  
  let totalHP = 0;
  
  for (const classItem of classes) {
    const hd = classItem.system.hd;  // Hit die size (6, 8, 10, 12)
    const levels = classItem.system.levels;
    const conMod = actor.system.abilities.con.mod;
    
    // First level: max HD
    totalHP += hd + conMod;
    
    // Remaining levels: roll
    for (let i = 1; i < levels; i++) {
      const roll = Math.floor(Math.random() * hd) + 1;
      totalHP += Math.max(1, roll + conMod);  // Min 1 HP per level
    }
  }
  
  // Update actor HP
  await actor.update({
    "system.attributes.hp.max": totalHP,
    "system.attributes.hp.value": totalHP
  });
}
```

---

### Phase 2: Testing & Refinement

#### 2.1: Test Basic Actor Creation
Create a test character:
1. Name + Ability Scores ✅ (already works)
2. Add Race (Human)
3. Add Class (Fighter, level 1)
4. Roll HP
5. Verify:
   - Race appears in actor sheet
   - Class appears with correct level
   - HP is calculated
   - BAB, saves, AC updated by system

#### 2.2: Handle Edge Cases
- Multiple classes (multiclassing)
- Races with level adjustment
- NPC vs PC actor types
- Error handling for missing compendiums

---

### Phase 3: Enhanced Features

#### 3.1: Add Starting Feats
```typescript
static async addFeat(actor: Actor, featName: string): Promise<void> {
  const pack = game.packs.get('D35E.feats');
  // Similar pattern to addRace/addClass
}
```

#### 3.2: Add Equipment from Template
```typescript
static async addEquipment(actor: Actor, itemNames: string[]): Promise<void> {
  const weaponPack = game.packs.get('D35E.weapons-and-ammo');
  const armorPack = game.packs.get('D35E.armors-and-shields');
  // Add and equip items
}
```

#### 3.3: Add Class Features
- Some are automatic (`automaticFeatures: true`)
- Others need to be added from `D35E.class-abilities`

#### 3.4: Handle Spellcasting
- For Wizard, Cleric, etc.
- Add known spells from `D35E.spells`
- Set spell slots

---

### Phase 4: UI Enhancements

#### 4.1: Dynamic Race/Class Dropdowns
Update `TownieMakerApp` to:
- Load races from compendium
- Load classes from compendium
- Display in dropdowns instead of hardcoded templates

#### 4.2: Level Selection
- Add level input for each class
- Support multiclassing

#### 4.3: Feat Selection
- Show available feats
- Let user choose starting feat

---

## 🚀 **Immediate Next Steps (Your Action Items)**

### Step 1: Implement Core Methods (30 minutes)
1. Update `addRace()` method
2. Update `addClass()` method
3. Update `rollHP()` method

### Step 2: Test in Foundry (15 minutes)
1. Build and deploy: `npm run deploy`
2. Create a test NPC using the Townie Maker
3. Check the actor sheet - does it have:
   - The race item?
   - The class item with correct level?
   - HP calculated?

### Step 3: Debug & Refine (ongoing)
- If anything doesn't work, check console for errors
- Use the debug commands to inspect data
- Iterate until it works!

---

## 📚 **References**

- **D35E_STRUCTURE.md** - Full compendium data
- **Foundry API Docs** - CompendiumCollection methods
- **D35E System** - Auto-calculates most derived stats

---

## 💡 **Important Notes**

### What D35E System Handles Automatically:
- ✅ Ability score modifiers from race
- ✅ BAB calculation from class
- ✅ Save calculations from class
- ✅ AC from DEX + armor
- ✅ Skill ranks (partial)

### What We Need to Handle:
- ❌ Adding race item to actor
- ❌ Adding class item(s) to actor
- ❌ Setting class levels
- ❌ Rolling HP
- ❌ Adding starting feats
- ❌ Adding equipment

---

## ✅ **Success Criteria**

A completed implementation should:
1. Create an actor with name and ability scores
2. Add a race item from compendium
3. Add one or more class items with levels
4. Calculate and set HP
5. Result in a functional character sheet that:
   - Shows correct race
   - Shows correct class(es) and levels
   - Has appropriate HP
   - Has calculated BAB, saves, AC

Ready to start coding! 🎉
