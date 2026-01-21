/**
 * Scroll creation utilities for Foundry VTT D35E system
 * 
 * Creates scroll consumables dynamically from spell definitions.
 * Scrolls are one-time use items for emergency and utility spells.
 */

import type { ScrollRecommendation } from './scroll-recommendations.js';

// Declare global game object
declare const game: any;

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
  
  return variants;
}

/**
 * Create a scroll item from a spell
 * 
 * @param spellId The compendium ID of the spell
 * @param casterLevel The caster level for the scroll
 * @param scrollType Whether this is an arcane or divine scroll
 * @param identifyItems Whether to create items as identified
 * @param spellName Optional spell name for fallback search if ID doesn't work
 * @returns The scroll item data
 */
export async function createScrollFromSpell(
  spellId: string,
  casterLevel: number,
  scrollType: 'arcane' | 'divine',
  identifyItems: boolean = true,
  spellName?: string
): Promise<any> {
  // Fetch the spell from the compendium
  const spellsPack = game.packs.get('D35E.spells');
  if (!spellsPack) {
    console.error('D35E.spells compendium not found!');
    return null;
  }
  
  // First try by ID
  let spell = await spellsPack.getDocument(spellId);
  
  // If not found by ID and we have a name, try searching by name (with variants)
  if (!spell && spellName) {
    await spellsPack.getIndex();
    
    // Generate name variants to search (e.g., "Greater Teleport" -> "Teleport, Greater")
    const nameVariants = getSpellNameVariants(spellName);
    
    for (const variant of nameVariants) {
      const spellEntry = spellsPack.index.find((entry: any) => 
        entry.name.toLowerCase() === variant.toLowerCase()
      );
      if (spellEntry) {
        spell = await spellsPack.getDocument(spellEntry._id);
        if (spell) break;
      }
    }
  }
  
  if (!spell) {
    console.error(`Spell not found in compendium: ${spellName || spellId}`);
    return null;
  }
  
  // Get spell level (look in system.learnedAt.class for the first matching class)
  const learnedAt = spell.system?.learnedAt?.class || [];
  let spellLevel = 1;
  
  // Parse the learnedAt array to find spell level
  for (const classData of learnedAt) {
    if (Array.isArray(classData) && classData.length >= 2) {
      const [className, level] = classData;
      if (scrollType === 'divine') {
        if (['Cleric', 'Druid', 'Paladin', 'Ranger'].includes(className)) {
          spellLevel = parseInt(level);
          break;
        }
      } else {
        if (['Wizard', 'Sorcerer'].includes(className)) {
          spellLevel = parseInt(level);
          break;
        }
      }
    }
  }
  
  // Calculate scroll price: spell level × caster level × 25 gp
  const price = spellLevel * casterLevel * 25;
  
  // Create the scroll item data
  const scrollData = {
    name: `Scroll of ${spell.name}`,
    type: 'consumable',
    img: 'systems/D35E/icons/items/magic/generated/scroll.png',
    system: {
      description: {
        value: `<p><strong>Aura</strong> ${getAuraStrength(casterLevel)} ${spell.system?.school || 'universal'}; <strong>CL</strong> ${casterLevel}th</p>\n<hr />\n@LinkedDescription[${spell.uuid}]\n`
      },
      quantity: 1,
      weight: 0,
      price: price,
      identified: identifyItems,
      identifiedName: `Scroll of ${spell.name}`,
      unidentified: {
        name: 'Scroll',
        price: 0
      },
      equipped: true,
      activation: {
        type: 'standard',
        cost: 1
      },
      uses: {
        value: 0,
        max: 0,
        per: 'single',
        autoDeductCharges: true
      },
      consumableType: 'scroll',
      scrollType: scrollType,
      isFromSpell: true,
      baseCl: casterLevel.toString(),
      save: {
        dc: 10 + spellLevel + Math.floor(casterLevel / 2),
        description: spell.system?.save?.description || ''
      },
      sr: spell.system?.sr || false
    }
  };
  
  return scrollData;
}

/**
 * Get aura strength based on caster level
 */
function getAuraStrength(casterLevel: number): string {
  if (casterLevel <= 5) return 'faint';
  if (casterLevel <= 11) return 'moderate';
  if (casterLevel <= 17) return 'strong';
  return 'overwhelming';
}

/**
 * Create and add scrolls to an actor
 * 
 * @param actor The actor to add scrolls to
 * @param scrolls Array of scroll recommendations
 * @param identifyItems Whether to create items as identified
 */
export async function createScrollsForActor(
  actor: any,
  scrolls: ScrollRecommendation[],
  identifyItems: boolean = true
): Promise<string[]> {
  if (scrolls.length === 0) {
    console.log('No scrolls to create');
    return [];
  }
  
  console.log(`Creating ${scrolls.length} scrolls for ${actor.name}...`);
  
  const scrollItems = [];
  
  for (const scrollRec of scrolls) {
    const scrollData = await createScrollFromSpell(
      scrollRec.spell.id,
      scrollRec.casterLevel,
      scrollRec.scrollType,
      identifyItems,
      scrollRec.spell.name  // Pass name for fallback lookup
    );
    
    if (scrollData) {
      scrollItems.push(scrollData);
      console.log(`Created scroll: Scroll of ${scrollRec.spell.name} (${scrollRec.scrollType}, CL ${scrollRec.casterLevel}, ${scrollRec.cost} gp)`);
    }
  }
  
  // Add all scrolls to the actor at once
  if (scrollItems.length > 0) {
    const created = await actor.createEmbeddedDocuments('Item', scrollItems);
    console.log(`Added ${scrollItems.length} scrolls to ${actor.name}`);
    return (created || []).map((i: any) => i.id).filter(Boolean);
  }

  return [];
}
