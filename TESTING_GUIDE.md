# Testing Guide - MOTWM Townie Maker

## 🧪 Core Functionality Testing

### Prerequisites
1. ✅ Foundry VTT running with D35E system
2. ✅ MOTWM Townie Maker module enabled
3. ✅ Module deployed (latest build)

---

## Test 1: Simple Human Fighter

### Goal
Create a basic level 1 Human Fighter to test all core functions.

### Steps
1. Open Foundry VTT
2. Go to **Actor Directory**
3. Click the **Townie Maker** button
4. Fill in the form:
   - **Template**: Select "Town Guard" (or any Fighter template)
   - **Name**: "Test Fighter"
   - **Race**: "Human"
   - **Class**: Fighter, Level 1
   - **Abilities**: Use Standard Array or roll
5. Click **Create NPC**

### Expected Results
- ✅ Actor created in Actor Directory
- ✅ Actor sheet opens automatically
- ✅ **Race tab** shows "Human" with racial features
- ✅ **Class tab** shows "Fighter" at level 1
- ✅ **Abilities** match what you entered
- ✅ **HP** is rolled (d10 + CON mod for Fighter)
- ✅ **BAB** is +1 (Fighter is high BAB)
- ✅ **Saves** calculated: Fort high, Ref/Will low
- ✅ **Skills** show Fighter class skills

### Check Console (F12)
Look for these log messages:
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

## Test 2: Elf Wizard (Different Race/Class)

### Goal
Test with a different race and spellcasting class.

### Steps
1. Click **Townie Maker** button again
2. Fill in:
   - **Name**: "Test Wizard"
   - **Race**: "Elf"
   - **Class**: Wizard, Level 1
   - **Abilities**: High INT (15+)
3. Create

### Expected Results
- ✅ Elf racial traits applied
- ✅ Wizard class with d4 HD
- ✅ Low BAB (+0)
- ✅ Will save high, Fort/Ref low
- ✅ Spellcasting section appears (even if empty)

---

## Test 3: Multi-Class Character

### Goal
Test if multiple classes work.

### Steps
1. Create new NPC:
   - **Name**: "Test Multiclass"
   - **Race**: "Human"
   - **Classes**: 
     - Fighter, Level 2
     - Rogue, Level 1
   - (You may need to modify templates or add this manually)

### Expected Results
- ✅ Both classes appear
- ✅ HP calculated from both (2d10 + 1d6 + CON×3)
- ✅ BAB calculated correctly
- ✅ Best saves from each class

---

## Test 4: Auto-Roll HP Setting

### Goal
Test the "Auto Roll HP" setting.

### Steps
1. Go to **Module Settings**
2. Find "MOTWM Townie Maker" settings
3. Toggle **Auto Roll HP** to OFF
4. Create a new NPC
5. Check if HP is 0 or not rolled

Then:
6. Toggle **Auto Roll HP** to ON
7. Create another NPC
8. Check if HP is rolled automatically

---

## Test 5: Different Actor Types

### Goal
Test NPC vs Character actor types.

### Steps
1. In **Module Settings**:
   - Set **Default Actor Type** to "NPC"
2. Create an actor - check if it's NPC type
3. Change to "Character"
4. Create an actor - check if it's PC type

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

## Success Criteria

### Minimum Viable Product ✅
- [x] Create actor with name
- [x] Set ability scores
- [x] Add race from compendium
- [x] Add class from compendium with level
- [x] Roll HP based on class HD
- [ ] **Actor appears functional in D35E system**

### Stretch Goals
- [ ] Add starting feats
- [ ] Add equipment from templates
- [ ] Add class features
- [ ] Support multiclassing properly
- [ ] Add spells for casters

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
3. Check D35E_STRUCTURE.md for data format
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
