# Equipment Implementation Plan

## Phase 1: Type Definitions (FIRST)

### Update types.d.ts
Add comprehensive equipment type definitions:

```typescript
export interface EquipmentItem {
  name: string;
  cost: number;  // in gold pieces
  weight?: number;
  quantity?: number;
}

export interface StartingKit {
  weapons: EquipmentItem[];
  armor?: EquipmentItem;
  shield?: EquipmentItem;
  gear: EquipmentItem[];
  tools?: EquipmentItem[];  // Special tools (thieves' tools, holy symbol, spellbook, etc.)
}

export interface TownieTemplate {
  // ... existing fields ...
  
  // Replace equipment?: string[] with:
  startingKit?: StartingKit;
}
```

## Phase 2: Wealth-by-Level Constants

Create `src/data/wealth.ts`:

```typescript
// Character wealth by level from D&D 3.5e SRD
export const WEALTH_BY_LEVEL: Record<number, number> = {
  1: 0,  // Will be calculated from class starting wealth
  2: 900,
  3: 2700,
  4: 5400,
  5: 9000,
  6: 13000,
  7: 19000,
  8: 27000,
  9: 36000,
  10: 49000,
  11: 66000,
  12: 88000,
  13: 110000,
  14: 150000,
  15: 200000,
  16: 260000,
  17: 340000,
  18: 440000,
  19: 580000,
  20: 760000
};

// Starting wealth by class (average of dice roll × 10 gp)
export const CLASS_STARTING_WEALTH: Record<string, number> = {
  "Barbarian": 100,  // 4d4×10 = 100
  "Bard": 100,       // 4d4×10 = 100
  "Cleric": 125,     // 5d4×10 = 125
  "Druid": 50,       // 2d4×10 = 50
  "Fighter": 150,    // 6d4×10 = 150
  "Monk": 25,        // 1d4×10 = 25
  "Paladin": 150,    // 6d4×10 = 150
  "Ranger": 150,     // 6d4×10 = 150
  "Rogue": 125,      // 5d4×10 = 125
  "Sorcerer": 75,    // 3d4×10 = 75
  "Wizard": 75,      // 3d4×10 = 75
  
  // NPC classes get minimum
  "Adept (NPC)": 50,
  "Aristocrat (NPC)": 150,
  "Commoner (NPC)": 25,
  "Expert (NPC)": 100,
  "Warrior (NPC)": 100
};
```

## Phase 3: Starting Equipment Kits

Update `src/data/templates.ts` to add starting kits. Example for Fighter (Town Guard):

```typescript
{
  id: "town-guard",
  name: "Town Guard",
  // ... existing fields ...
  startingKit: {
    weapons: [
      { name: "Longsword", cost: 15 },
      { name: "Longbow", cost: 75 },
      { name: "Arrows", cost: 1, quantity: 20 }
    ],
    armor: { name: "Scale Mail", cost: 50 },
    shield: { name: "Heavy Steel Shield", cost: 20 },
    gear: [
      { name: "Backpack", cost: 2 },
      { name: "Bedroll", cost: 0.1 },
      { name: "Waterskin", cost: 1 },
      { name: "Trail Rations", cost: 0.5, quantity: 7 },
      { name: "Rope, Hempen (50 ft.)", cost: 1 },
      { name: "Flint and Steel", cost: 1 }
    ]
  }
}
```

## Phase 4: Equipment System in d35e-adapter.ts

Add new function to purchase and equip items:

```typescript
async function addEquipment(
  actor: any,
  template: TownieTemplate,
  level: number
): Promise<void> {
  console.log(`\n=== EQUIPMENT SYSTEM ===`);
  console.log(`Template: ${template.name}, Level: ${level}`);
  
  // Step 1: Calculate total wealth
  const className = template.classes?.[0]?.name || "Fighter";
  const totalWealth = level === 1 
    ? CLASS_STARTING_WEALTH[className] || 100
    : WEALTH_BY_LEVEL[level] || 0;
  
  console.log(`Total Wealth: ${totalWealth} gp`);
  
  // Step 2: Calculate mundane equipment cost
  const kit = template.startingKit;
  if (!kit) {
    console.log("No starting kit defined, skipping equipment");
    return;
  }
  
  const mundaneCost = calculateKitCost(kit);
  console.log(`Mundane Equipment Cost: ${mundaneCost} gp`);
  
  // Step 3: Add mundane items to character
  await addMundaneItems(actor, kit);
  
  // Step 4: Calculate magic item budget
  const magicBudget = totalWealth - mundaneCost;
  console.log(`Magic Item Budget: ${magicBudget} gp`);
  
  // Step 5: Buy magic items (Phase 5 implementation)
  // const magicItems = await selectMagicItems(actor, magicBudget, level, template);
  // await addMagicItems(actor, magicItems);
  
  // Step 6: Add remaining wealth as coins
  const remainder = magicBudget;  // Will subtract magic cost in Phase 5
  await addCoins(actor, remainder);
  
  console.log("=== EQUIPMENT COMPLETE ===\n");
}

function calculateKitCost(kit: StartingKit): number {
  let total = 0;
  
  kit.weapons?.forEach(w => total += w.cost * (w.quantity || 1));
  if (kit.armor) total += kit.armor.cost;
  if (kit.shield) total += kit.shield.cost;
  kit.gear?.forEach(g => total += g.cost * (g.quantity || 1));
  kit.tools?.forEach(t => total += t.cost * (t.quantity || 1));
  
  return total;
}

async function addMundaneItems(actor: any, kit: StartingKit): Promise<void> {
  const items: any[] = [];
  
  // Add weapons
  for (const weapon of kit.weapons || []) {
    const itemData = await findItemInCompendium("weapon", weapon.name);
    if (itemData) {
      items.push({
        ...itemData,
        system: {
          ...itemData.system,
          quantity: weapon.quantity || 1
        }
      });
    }
  }
  
  // Add armor
  if (kit.armor) {
    const itemData = await findItemInCompendium("armor", kit.armor.name);
    if (itemData) items.push(itemData);
  }
  
  // Add shield
  if (kit.shield) {
    const itemData = await findItemInCompendium("armor", kit.shield.name);
    if (itemData) items.push(itemData);
  }
  
  // Add gear
  for (const item of kit.gear || []) {
    const itemData = await findItemInCompendium("loot", item.name);
    if (itemData) {
      items.push({
        ...itemData,
        system: {
          ...itemData.system,
          quantity: item.quantity || 1
        }
      });
    }
  }
  
  // Add tools
  for (const tool of kit.tools || []) {
    const itemData = await findItemInCompendium("loot", tool.name);
    if (itemData) {
      items.push({
        ...itemData,
        system: {
          ...itemData.system,
          quantity: tool.quantity || 1
        }
      });
    }
  }
  
  // Create all items on actor
  if (items.length > 0) {
    await actor.createEmbeddedDocuments("Item", items);
    console.log(`Added ${items.length} mundane items`);
  }
}

async function findItemInCompendium(type: string, name: string): Promise<any> {
  // Search D35E compendiums for matching item
  const packNames = {
    weapon: "D35E.weapons",
    armor: "D35E.armor", 
    loot: "D35E.items"
  };
  
  const packName = packNames[type as keyof typeof packNames];
  if (!packName) return null;
  
  const pack = game.packs.get(packName);
  if (!pack) return null;
  
  const index = await pack.getIndex();
  const entry = index.find((e: any) => 
    e.name.toLowerCase() === name.toLowerCase()
  );
  
  if (!entry) {
    console.warn(`Item not found in compendium: ${name}`);
    return null;
  }
  
  return await pack.getDocument(entry._id);
}

async function addCoins(actor: any, amount: number): Promise<void> {
  // Convert to coin denominations
  const pp = Math.floor(amount / 10);
  amount -= pp * 10;
  
  const gp = Math.floor(amount);
  amount -= gp;
  
  const sp = Math.floor(amount * 10);
  amount -= sp / 10;
  
  const cp = Math.round(amount * 100);
  
  // Set currency on actor
  await actor.update({
    "system.currency.pp": pp,
    "system.currency.gp": gp,
    "system.currency.sp": sp,
    "system.currency.cp": cp
  });
  
  console.log(`Added coins: ${pp}pp ${gp}gp ${sp}sp ${cp}cp`);
}
```

## Phase 5: Magic Item Selection (FUTURE)

This is complex and will require:
1. Magic item database/compendiums
2. Selection algorithm based on class, level, and budget
3. Priority system (weapon enhancements first, then armor, then other)

For now, we'll focus on Phases 1-4 to get mundane equipment working.

## Implementation Order

1. ✅ Research SRD prices (DONE - see EQUIPMENT_PLANNING.md)
2. ⏳ **Update types.d.ts** with equipment types
3. ⏳ **Create wealth.ts** with wealth tables
4. ⏳ **Update templates.ts** with starting kits for each template
5. ⏳ **Implement addEquipment()** in d35e-adapter.ts
6. ⏳ Test with various templates and levels
7. ⏳ Phase 5: Magic items (future enhancement)

## Testing Plan

Test each template at multiple levels:
- Level 1: Uses class starting wealth, basic kit only
- Level 5: Mid-level, small magic item budget (~9k gp)
- Level 10: Higher level, good magic budget (~49k gp)
- Level 15: High level, large magic budget (~200k gp)

Verify:
- Mundane items are added to inventory
- Coins are correctly calculated and added
- No errors in console
- Items match template's class/role

## Notes

- Keep mundane kits simple and thematic
- Don't worry about optimization - these are NPCs
- Magic items can wait for Phase 5
- Focus on getting the basics working first
