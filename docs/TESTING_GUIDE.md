# Beta Testing Guide - MOTWM Townie Maker

## 🧪 Core Functionality Testing

### Prerequisites
1. ✅ Foundry VTT running with D35E system
2. ✅ MOTWM Townie Maker module enabled
3. ✅ Module deployed (latest build)

Tip: Run the tests with the browser console open (F12) so you can capture errors and `D35EAdapter | ...` logs.

---

## Test 1: Simple Martial (sanity check)

### Goal
Create a basic level 1 martial to confirm the full creation pipeline completes.

### Steps
1. Open Foundry VTT
2. Go to **Actor Directory**
3. Click the **Townie Maker** button
4. Fill in the form:
   - **Template**: Select a martial template (e.g., Town Guard)
   - **Name**: "Test Martial"
   - **Sheet Type**: PC Sheet (Full Features)
   - **Abilities**: Use Standard Array or roll
5. Click **Create NPC**

### Expected Results
- ✅ Actor created in Actor Directory
- ✅ Actor sheet opens automatically
- ✅ Abilities match what you entered
- ✅ Race + class items exist on the actor (sheet shows them somewhere appropriate for D35E)
- ✅ If **Auto-Roll HP** is enabled, HP is non-zero for PC sheets
- ✅ No uncaught errors in the console

### Check Console (F12)
Look for log messages like:
```
D35EAdapter | Added race Human to Test Fighter
D35EAdapter | Added class Fighter level 1 to Test Fighter
D35EAdapter | Rolled HP for Test Fighter: X
```

### If It Fails
- Check console for error messages
- Note which step failed:
  - Actor creation?
  - Race addition?
  - Class addition?
  - HP rolling?

---

## Test 2: Caster (spells + consumables)

### Goal
Verify caster configuration runs without errors (spells, consumables, inventory organization).

### Steps
1. Click **Townie Maker** button again
2. Fill in:
   - **Template**: Select a caster template (e.g., Wizard/Cleric)
   - **Name**: "Test Caster"
   - **Sheet Type**: PC Sheet (Full Features)
3. Create

### Expected Results
- ✅ Actor is created and opens
- ✅ No uncaught errors in the console
- ✅ If the template generates spells/scrolls/wands/potions, they exist in inventory

---

## Test 3: Higher-level build (budgets + magic items)

### Goal
Exercise the budget and equipment logic by creating a mid/high-level NPC.

### Steps
1. Create a new NPC using a template that supports higher levels.
2. Set a level like 10 or 15.

### Expected Results
- ✅ Equipment is created and equipped appropriately
- ✅ Magic weapon/armor enhancements appear when expected
- ✅ Any remaining wealth is applied as coins/items as designed

---

## Test 4: Auto-Roll HP setting

### Goal
Test the "Auto Roll HP" setting.

### Steps
1. Go to **Module Settings**
2. Find "MOTWM Townie Maker" settings
3. Toggle **Auto Roll HP** to OFF
4. Create a new NPC
5. Create a new PC-sheet actor; check if HP is left unrolled/unchanged

Then:
6. Toggle **Auto Roll HP** to ON
7. Create another NPC
8. Create another PC-sheet actor; check if HP is rolled automatically

---

## Test 5: Sheet Type behavior

### Goal
Test PC Sheet vs Simple NPC Sheet behavior.

### Steps
1. In **Module Settings**:
   - Set **Default Sheet Type** to "Simple NPC Sheet (Manual HP)"
2. Create an actor; confirm it uses the simple NPC sheet flow
3. Switch **Default Sheet Type** back to "PC Sheet (Full Features)" and create another actor

---

## Common Issues & Solutions

### Issue: "Pack 'D35E.racialfeatures' not found"
**Solution**: 
- D35E system not installed or not enabled
- Check if you're using a different D&D system

### Issue: "Race 'Human' not found in compendium"
**Solution**:
- Race name spelling doesn't match exactly
- Run: `MOTWM_TOWNIE.debugPack('D35E.racialfeatures')` to see exact names
- Update templates with correct names

### Issue: No HP rolled
**Solution**:
- Check "Auto Roll HP" setting is ON
- Check console for errors in rollHP()
- Verify classes were added successfully

### Issue: Actor created but empty
**Solution**:
- Race/class addition failed silently
- Check console for errors
- Check that compendiums are accessible

### Issue: BAB/Saves/Skills not calculated
**Solution**:
- This is handled by D35E system, not our module
- D35E should auto-calculate when class is added
- Try opening/closing the actor sheet
- Check if class item has correct level set

---

## Advanced Testing

### Test: Custom Race Names
Try creating NPCs with different races from the compendium:
- Dwarf
- Halfling  
- Gnome
- Half-Elf
- Half-Orc

### Test: All Base Classes
Create one NPC of each base class:
- Barbarian
- Bard
- Cleric
- Druid
- Fighter
- Monk
- Paladin
- Ranger
- Rogue
- Sorcerer
- Wizard

Verify HD, BAB, and saves for each.

### Test: NPC Classes
- Warrior (NPC)
- Expert
- Commoner
- Aristocrat

---

## What “pass” looks like for beta

- Creation completes without uncaught errors.
- Actor opens and is usable in D35E sheets.
- Major expected content appears (race/class items, ability scores, equipment; spells/consumables when applicable).

---

## Reporting Issues

When reporting bugs, please include:
1. **What you were trying to do**
2. **What happened**
3. **Console errors** (F12 → Console tab)
4. **Actor data** (run in console):
   ```javascript
   game.actors.getName("Actor Name").toObject()
   ```

---

## Next Steps After Testing

### If Tests Pass ✅
1. Update templates with correct race/class names
2. Add more templates
3. Implement feat selection
4. Add equipment

### If Tests Fail ❌
1. Document which test failed
2. Copy console errors
3. If you need deep system structure notes, see `archive/D35E_STRUCTURE.md`
4. Debug and fix issues
5. Re-test

---

## Quick Console Commands for Testing

```javascript
// See all actors
game.actors.contents

// Get specific actor
const actor = game.actors.getName("Test Fighter");

// See actor items
actor.items.map(i => ({ name: i.name, type: i.type }))

// See actor data
actor.toObject()

// Delete test actors
game.actors.getName("Test Fighter").delete()
```

---

Good luck testing! 🎉
