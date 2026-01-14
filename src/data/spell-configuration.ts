/**
 * Spell Configuration and Creation System
 * 
 * Handles:
 * 1. Configuring actor's spellbook (attributes.spells.spellbooks.primary)
 * 2. Fetching spells from D35E.spells compendium
 * 3. Adding spell items to actor with proper linking
 */

import { SpellSelection, SpellItem, isCasterClass } from './spell-selection';

// Declare global game object (Foundry VTT runtime)
declare const game: any;

/**
 * Configure an actor's spellbook
 * Sets up attributes.spells.spellbooks.primary with proper configuration
 */
export async function configureSpellbook(actor: any, spellSelection: SpellSelection): Promise<void> {
  const config = spellSelection.spellbookConfig;
  
  console.log(`Configuring ${config.class} spellbook for ${actor.name}:`);
  console.log(`  Caster Level: ${config.casterLevel}`);
  console.log(`  Casting Ability: ${config.ability.toUpperCase()}`);
  console.log(`  Type: ${config.spontaneous ? 'Spontaneous' : 'Prepared'}`);
  
  // Build the spellbook data structure
  const spellbookData = {
    primary: {
      name: config.name,
      class: config.class,
      cl: {
        base: 0,
        value: 0,
        total: config.casterLevel,
        formula: ''
      },
      concentration: 0,
      bonusPrestigeCl: 0,
      concentrationFormula: '',
      concentrationNotes: '',
      clNotes: '',
      ability: config.ability,
      spellslotAbility: '',
      autoSpellLevels: true,
      usePowerPoints: false,
      autoSetup: true,
      spellcastingType: config.spellcastingType,
      powerPointsFormula: '',
      dailyPowerPointsFormula: '',
      powerPoints: 0,
      powerPointsTotal: 0,
      maximumPowerPointLimit: '@cl',
      arcaneSpellFailure: config.arcaneSpellFailure,
      baseDCFormula: '10 + @sl + @ablMod',
      spontaneous: config.spontaneous,
      hasSpecialSlot: config.hasSpecialSlot,
      showOnlyPrepared: false,
      specialSlots: {
        level1: null,
        level2: null,
        level3: null,
        level4: null,
        level5: null,
        level6: null,
        level7: null,
        level8: null,
        level9: null
      },
      maxPrestigeCl: 0,
      allSpellsKnown: false,
      hasPrestigeCl: false,
      canAddPrestigeCl: false,
      canRemovePrestigeCl: false,
      powersKnown: 0,
      powersMaxLevel: 0,
      powerPointsValue: {
        max: 0,
        value: 0
      },
      spells: {
        spell0: {
          value: 0,
          max: config.spellSlots.spell0.max,
          base: config.spellSlots.spell0.max,
          known: 0,
          maxKnown: 0,
          bonus: 0,
          classBase: config.spellSlots.spell0.max
        },
        spell1: {
          value: 0,
          max: config.spellSlots.spell1.max,
          base: config.spellSlots.spell1.max,
          known: 0,
          maxKnown: 0,
          bonus: 0,
          classBase: config.spellSlots.spell1.max
        },
        spell2: {
          value: 0,
          max: config.spellSlots.spell2.max,
          base: config.spellSlots.spell2.max,
          known: 0,
          maxKnown: 0,
          bonus: 0,
          classBase: config.spellSlots.spell2.max
        },
        spell3: {
          value: 0,
          max: config.spellSlots.spell3.max,
          base: config.spellSlots.spell3.max,
          known: 0,
          maxKnown: 0,
          bonus: 0,
          classBase: config.spellSlots.spell3.max
        },
        spell4: {
          value: 0,
          max: config.spellSlots.spell4.max,
          base: config.spellSlots.spell4.max,
          known: 0,
          maxKnown: 0,
          bonus: 0,
          classBase: config.spellSlots.spell4.max
        },
        spell5: {
          value: 0,
          max: config.spellSlots.spell5.max,
          base: config.spellSlots.spell5.max,
          known: 0,
          maxKnown: 0,
          bonus: 0,
          classBase: config.spellSlots.spell5.max
        },
        spell6: {
          value: 0,
          max: config.spellSlots.spell6.max,
          base: config.spellSlots.spell6.max,
          known: 0,
          maxKnown: 0,
          bonus: 0,
          classBase: config.spellSlots.spell6.max
        },
        spell7: {
          value: 0,
          max: config.spellSlots.spell7.max,
          base: config.spellSlots.spell7.max,
          known: 0,
          maxKnown: 0,
          bonus: 0,
          classBase: config.spellSlots.spell7.max
        },
        spell8: {
          value: 0,
          max: config.spellSlots.spell8.max,
          base: config.spellSlots.spell8.max,
          known: 0,
          maxKnown: 0,
          bonus: 0,
          classBase: config.spellSlots.spell8.max
        },
        spell9: {
          value: 0,
          max: config.spellSlots.spell9.max,
          base: config.spellSlots.spell9.max,
          known: 0,
          maxKnown: 0,
          bonus: 0,
          classBase: config.spellSlots.spell9.max
        }
      },
      spellcastingAbilityBonus: 0,
      availablePrestigeCl: 0
    }
  };
  
  // Update actor with spellbook configuration
  await actor.update({
    'system.attributes.spells.spellbooks': spellbookData
  });
  
  console.log(`Spellbook configured successfully for ${actor.name}`);
}

/**
 * Generate alternate spell name formats to search for.
 * D35E compendium may use "Spell, Greater" instead of "Greater Spell" etc.
 */
function getSpellNameVariants(name: string): string[] {
  const variants: string[] = [name];
  
  // Handle "Greater X" -> "X, Greater"
  if (name.startsWith('Greater ')) {
    const baseName = name.replace('Greater ', '');
    variants.push(`${baseName}, Greater`);
  }
  // Handle "Lesser X" -> "X, Lesser"
  if (name.startsWith('Lesser ')) {
    const baseName = name.replace('Lesser ', '');
    variants.push(`${baseName}, Lesser`);
  }
  // Handle "Mass X" -> "X, Mass"
  if (name.startsWith('Mass ')) {
    const baseName = name.replace('Mass ', '');
    variants.push(`${baseName}, Mass`);
  }
  
  // Also try the reverse: "X, Greater" -> "Greater X"
  if (name.includes(', Greater')) {
    variants.push('Greater ' + name.replace(', Greater', ''));
  }
  if (name.includes(', Lesser')) {
    variants.push('Lesser ' + name.replace(', Lesser', ''));
  }
  if (name.includes(', Mass')) {
    variants.push('Mass ' + name.replace(', Mass', ''));
  }
  
  return variants;
}

/**
 * Add spells to an actor from the D35E.spells compendium
 */
export async function addSpellsToActor(actor: any, spellSelection: SpellSelection): Promise<void> {
  const spells = spellSelection.spells;
  
  if (!spells || spells.length === 0) {
    console.log(`No spells to add for ${actor.name}`);
    return;
  }
  
  console.log(`Adding ${spells.length} spells to ${actor.name}...`);
  
  // Get the D35E.spells compendium
  const spellPack = (game as any).packs?.get('D35E.spells');
  if (!spellPack) {
    console.error('D35E.spells compendium not found!');
    return;
  }
  
  // Load the index
  await spellPack.getIndex();
  
  const spellItems = [];
  let foundCount = 0;
  let notFoundCount = 0;
  
  for (const spell of spells) {
    try {
      // Search for spell by name (case-insensitive), trying name variants
      const nameVariants = getSpellNameVariants(spell.name);
      let spellEntry = null;
      
      for (const variant of nameVariants) {
        spellEntry = spellPack.index.find((entry: any) => 
          entry.name.toLowerCase() === variant.toLowerCase()
        );
        if (spellEntry) break;
      }
      
      if (!spellEntry) {
        console.warn(`  ⚠ Spell not found in compendium: ${spell.name} (level ${spell.level})`);
        notFoundCount++;
        continue;
      }
      
      // Get the full spell document
      const spellDoc = await spellPack.getDocument(spellEntry._id);
      if (!spellDoc) {
        console.warn(`  ⚠ Could not load spell document: ${spell.name}`);
        notFoundCount++;
        continue;
      }
      
      // Clone the spell data
      const spellData = spellDoc.toObject();
      
      // Configure for this character
      spellData.system.spellbook = 'primary';
      spellData.system.preparation = {
        preparedAmount: 0,
        maxAmount: 0,
        autoDeductCharges: true,
        mode: spell.preparationMode
      };
      
      spellItems.push(spellData);
      foundCount++;
      
    } catch (error) {
      console.error(`  ✗ Error loading spell ${spell.name}:`, error);
      notFoundCount++;
    }
  }
  
  // Add all spells to actor
  if (spellItems.length > 0) {
    await actor.createEmbeddedDocuments('Item', spellItems);
    console.log(`✓ Successfully added ${foundCount} spells to ${actor.name}`);
    
    // Log spell breakdown by level
    const spellsByLevel: Record<number, number> = {};
    for (const spell of spells) {
      spellsByLevel[spell.level] = (spellsByLevel[spell.level] || 0) + 1;
    }
    
    console.log('Spell breakdown by level:');
    for (let level = 0; level <= 9; level++) {
      if (spellsByLevel[level]) {
        console.log(`  Level ${level}: ${spellsByLevel[level]} spells`);
      }
    }
  }
  
  if (notFoundCount > 0) {
    console.warn(`⚠ ${notFoundCount} spells could not be found or loaded`);
  }
}

/**
 * Main function to configure spells for a caster
 * Combines spellbook configuration and spell addition
 */
export async function configureSpellsForActor(
  actor: any,
  characterClass: string,
  level: number,
  abilityScores: { int: number; wis: number; cha: number }
): Promise<void> {
  // Check if this is a caster class
  if (!isCasterClass(characterClass)) {
    console.log(`${actor.name} (${characterClass}) is not a spellcaster`);
    return;
  }
  
  // Paladin and Ranger don't cast until level 4
  if ((characterClass === 'paladin' || characterClass === 'ranger') && level < 4) {
    console.log(`${actor.name} (${characterClass} ${level}) doesn't cast spells yet (needs level 4+)`);
    return;
  }
  
  console.log(`\n=== CONFIGURING SPELLS FOR ${actor.name.toUpperCase()} ===`);
  console.log(`Class: ${characterClass}, Level: ${level}`);
  
  // Import and call the appropriate spell selector
  let spellSelection: any = null;
  
  try {
    const { selectSpells } = await import('./spell-selection');
    spellSelection = await selectSpells(characterClass as any, level, abilityScores);
    
    if (!spellSelection) {
      console.log(`No spell selection returned for ${characterClass}`);
      return;
    }
    
    console.log(`Spell selection received: ${spellSelection.spells.length} spells`);
    
    // Step 1: Configure spellbook
    await configureSpellbook(actor, spellSelection);
    
    // Step 2: Add spells
    await addSpellsToActor(actor, spellSelection);
    
    console.log(`=== SPELL CONFIGURATION COMPLETE ===\n`);
    
  } catch (error) {
    console.error(`Failed to configure spells for ${actor.name}:`, error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
  }
}
