/**
 * Wand creation utilities
 * 
 * Creates wand items dynamically from spell definitions. Wands in D35E are created
 * by the system when you drag a spell to inventory, but we need to create them
 * programmatically for NPCs.
 */

import { SpellDefinition, calculateWandCost } from './spells.js';
import { WandRecommendation } from './wand-recommendations.js';

// @ts-ignore - game is global in Foundry
declare const game: any;

/**
 * Create a wand item from a spell
 * 
 * Based on the wand structure from the D35E system:
 * - type: "consumable"
 * - system.consumableType: "wand"
 * - system.isFromSpell: true
 * - system.baseCl: caster level
 * - system.uses: { value: 50, max: 50, per: "charges" }
 * 
 * @param actor The actor to add the wand to
 * @param spell The spell to create a wand from
 * @param casterLevel The caster level for the wand
 * @param identifyItems If true, wand will be identified; if false, unidentified
 * @returns The created wand item or null if failed
 */
export async function createWandFromSpell(
  actor: any,
  spell: SpellDefinition,
  casterLevel: number,
  identifyItems: boolean = false
): Promise<any | null> {
  try {
    // Get the spell from the compendium
    const spellsPack = game.packs.get('D35E.spells');
    if (!spellsPack) {
      console.error('D35E.spells compendium not found');
      return null;
    }
    
    const spellDoc = await spellsPack.getDocument(spell.id);
    if (!spellDoc) {
      console.error(`Spell not found in compendium: ${spell.name} (${spell.id})`);
      return null;
    }
    
    // Calculate wand cost
    const cost = calculateWandCost(spell.level, casterLevel);
    
    // Create wand item data
    // The D35E system automatically handles spell linking when isFromSpell is true
    const wandData = {
      name: `Wand of ${spell.name}`,
      type: 'consumable',
      img: 'systems/D35E/icons/items/magic/generated/wand-low.png',
      system: {
        consumableType: 'wand',
        isFromSpell: true,
        baseCl: casterLevel.toString(),
        price: cost,
        quantity: 1,
        weight: 0,
        identified: identifyItems,
        identifiedName: `Wand of ${spell.name}`,
        unidentified: {
          name: 'Wand',
          price: 0
        },
        uses: {
          value: 50,
          max: 50,
          per: 'charges',
          autoDeductCharges: true,
          allowMultipleUses: false,
          chargesPerUse: 1,
          maxFormula: '50'
        },
        description: {
          value: `<p><strong>Aura</strong> faint ${spell.school}; <strong>CL</strong> ${casterLevel}</p>\n<hr />\n@LinkedDescription[Compendium.D35E.spells.Item.${spell.id}]`,
          chat: '',
          unidentified: ''
        },
        activation: {
          cost: 1,
          type: 'standard'
        },
        // Copy spell data for the wand's effect
        actionType: spellDoc.system?.actionType || 'other',
        save: spellDoc.system?.save || { dc: 10 + spell.level + Math.floor((casterLevel - 1) / 2) },
        sr: spellDoc.system?.sr || false,
        pr: spellDoc.system?.pr || false,
        damage: spellDoc.system?.damage || { parts: [], alternativeParts: [] },
        formula: spellDoc.system?.formula || '',
        effectNotes: spellDoc.system?.effectNotes || '',
        attackNotes: spellDoc.system?.attackNotes || '',
        range: spellDoc.system?.range || {},
        target: spellDoc.system?.target || {},
        duration: spellDoc.system?.duration || {}
      }
    };
    
    // Create the item on the actor
    const [createdItem] = await actor.createEmbeddedDocuments('Item', [wandData]);
    
    console.log(`Created wand: ${wandData.name} (CL ${casterLevel}, ${cost} gp)`);
    
    return createdItem;
  } catch (error) {
    console.error(`Failed to create wand for spell ${spell.name}:`, error);
    return null;
  }
}

/**
 * Add wands to an actor based on recommendations
 * 
 * @param actor The actor to add wands to
 * @param wands Array of wand recommendations
 * @param identifyItems Whether to create items as identified
 * @returns Number of wands successfully created
 */
export async function addWandsToActor(
  actor: any,
  wands: WandRecommendation[],
  identifyItems: boolean = true
): Promise<number> {
  let successCount = 0;
  
  for (const wandRec of wands) {
    const wand = await createWandFromSpell(actor, wandRec.spell, wandRec.casterLevel, identifyItems);
    if (wand) {
      successCount++;
    }
  }
  
  console.log(`Added ${successCount} of ${wands.length} wands to ${actor.name}`);
  
  return successCount;
}

/**
 * Equip wands on an actor
 * Wands don't need to be "equipped" in the traditional sense, but this ensures
 * they're marked as carried and ready to use.
 * 
 * @param actor The actor to equip wands on
 */
export async function equipWands(actor: any): Promise<void> {
  const wands = actor.items.filter((item: any) =>
    item.type === 'consumable' && item.system?.consumableType === 'wand'
  );
  
  for (const wand of wands) {
    if (!wand.system.carried) {
      await wand.update({ 'system.carried': true });
    }
  }
  
  console.log(`Equipped ${wands.length} wands on ${actor.name}`);
}
