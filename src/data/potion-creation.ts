/**
 * Potion creation system for D&D 3.5e
 * Creates consumable potion items from definitions
 */

import { PotionRecommendation } from './magic-item-system';
import { POTION_DEFINITIONS } from './potion-recommendations';

/**
 * Create a potion item from a potion name
 * 
 * @param potionName - Name of the potion (e.g., "Cure Light Wounds")
 * @param quantity - Number of this potion to create
 * @returns Potion item data for D35E system
 */
export function createPotionFromName(potionName: string, quantity: number = 1): any {
  // Find the potion definition
  const potionEntry = Object.entries(POTION_DEFINITIONS).find(
    ([_, def]) => def.name === potionName
  );
  
  if (!potionEntry) {
    console.warn(`Potion not found: ${potionName}`);
    return null;
  }
  
  const [potionId, potion] = potionEntry;
  
  // Determine aura strength based on caster level
  const auraStrength = getAuraStrength(potion.casterLevel);
  
  // Determine potion icon - red for healing, blue for other effects
  const isHealingPotion = potion.name.includes('Cure') || potion.name.includes('Restoration');
  const potionIcon = isHealingPotion 
    ? 'icons/consumables/potions/vial-cork-red.webp'
    : 'icons/consumables/potions/vial-cork-blue.webp';
  
  // Create potion item data
  return {
    name: `Potion of ${potion.name}`,
    type: 'consumable',
    img: potionIcon,
    system: {
      description: {
        value: `<p>A potion of ${potion.name.toLowerCase()}. When consumed, it functions as the spell ${potion.name.toLowerCase()} cast at caster level ${potion.casterLevel}.</p>
<p><strong>Aura:</strong> ${auraStrength} conjuration (healing) or transmutation (enhancement); <strong>CL:</strong> ${potion.casterLevel}th; <strong>Price:</strong> ${potion.cost} gp</p>
<p>${potion.reasoning}</p>`
      },
      quantity: quantity,
      weight: 0.1, // Potions weigh approximately 0.1 lb each
      price: potion.cost,
      identified: true,
      consumableType: 'potion',
      uses: {
        value: 0,
        max: 0,
        per: 'single' // Single-use item
      },
      baseCl: potion.casterLevel,
      unchainedAction: {
        activation: {
          cost: 1,
          type: 'standard'
        }
      },
      tags: [
        ['potion'],
        [potion.spellLevel === 1 ? '1st-level' : potion.spellLevel === 2 ? '2nd-level' : '3rd-level']
      ]
    }
  };
}

/**
 * Determine aura strength based on caster level
 * Faint (1-5), Moderate (6-11), Strong (12-17), Overwhelming (18+)
 */
function getAuraStrength(casterLevel: number): string {
  if (casterLevel <= 5) return 'faint';
  if (casterLevel <= 11) return 'moderate';
  if (casterLevel <= 17) return 'strong';
  return 'overwhelming';
}

/**
 * Create and add potions to an actor
 * 
 * @param actor - The D35E actor to add potions to
 * @param potions - Array of potion recommendations
 */
export async function createPotionsForActor(actor: any, potions: PotionRecommendation[]): Promise<void> {
  if (!potions || potions.length === 0) {
    return;
  }
  
  console.log(`Creating ${potions.length} different types of potions for ${actor.name}:`);
  
  const potionItems = [];
  for (const potion of potions) {
    const potionData = createPotionFromName(potion.name, potion.quantity);
    if (potionData) {
      console.log(`  - ${potion.quantity}x ${potionData.name} (${potion.cost} gp each, ${potion.cost * potion.quantity} gp total)`);
      potionItems.push(potionData);
    }
  }
  
  if (potionItems.length > 0) {
    await actor.createEmbeddedDocuments('Item', potionItems);
    console.log(`Successfully added ${potionItems.length} types of potions to ${actor.name}`);
  }
}
