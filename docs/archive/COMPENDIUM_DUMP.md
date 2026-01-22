# How to Dump D35E Compendium Data

If you need to see what items are available in the D35E compendiums, run these commands in the Foundry VTT console (F12 -> Console tab):

## Dump Magic Items Compendium

```javascript
// Get all magic items
const pack = game.packs.get('D35E.magicitems');
const items = await pack.getDocuments();

// Filter to wondrous items only
const wondrousItems = items.filter(i => i.type === 'equipment' && i.system.slot);

// Create a formatted list
const itemList = wondrousItems.map(item => {
  return {
    id: item._id,
    name: item.name,
    slot: item.system.slot,
    price: item.system.price,
    type: item.type
  };
}).sort((a, b) => a.name.localeCompare(b.name));

// Print the list
console.table(itemList);

// Or copy to clipboard as JSON
copy(JSON.stringify(itemList, null, 2));
```

## Dump Specific Item Types

### Boots
```javascript
const pack = game.packs.get('D35E.magicitems');
const items = await pack.getDocuments();
const boots = items.filter(i => i.name.toLowerCase().includes('boots'));
console.table(boots.map(i => ({id: i._id, name: i.name, price: i.system.price})));
```

### Bags/Containers
```javascript
const pack = game.packs.get('D35E.magicitems');
const items = await pack.getDocuments();
const bags = items.filter(i => i.name.toLowerCase().includes('bag') || i.name.toLowerCase().includes('haversack'));
console.table(bags.map(i => ({id: i._id, name: i.name, price: i.system.price})));
```

### All Wondrous by Slot
```javascript
const pack = game.packs.get('D35E.magicitems');
const items = await pack.getDocuments();
const wondrous = items.filter(i => i.type === 'equipment' && i.system.slot);
const bySlot = {};
for (const item of wondrous) {
  const slot = item.system.slot || 'none';
  if (!bySlot[slot]) bySlot[slot] = [];
  bySlot[slot].push({id: item._id, name: item.name, price: item.system.price});
}
console.log(bySlot);
copy(JSON.stringify(bySlot, null, 2));
```

## Search for Specific Item

```javascript
const pack = game.packs.get('D35E.magicitems');
const items = await pack.getDocuments();
const searchTerm = 'haversack'; // Change this
const results = items.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));
console.table(results.map(i => ({
  id: i._id,
  name: i.name,
  type: i.type,
  slot: i.system.slot,
  price: i.system.price
})));
```

## After Running

The `copy()` command will copy the JSON to your clipboard. You can then paste it here or into a file for reference.
