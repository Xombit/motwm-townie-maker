/**
 * Rod and Staff lookup utilities
 * 
 * Finds rod and staff items in D35E compendiums and adds them to actors.
 * Items are looked up by their hardcoded compendium ID for reliability.
 * 
 * Compendium: D35E.magicitems contains rods and staves
 * All IDs are hardcoded in rod-staff-recommendations.ts
 */

import { 
  MetamagicRodDefinition, 
  StaffDefinition,
  RodRecommendation,
  StaffRecommendation
} from './rod-staff-recommendations';

// @ts-ignore - game is global in Foundry
declare const game: any;

/**
 * Get an item directly from compendium by ID
 */
async function getItemById(itemId: string): Promise<any | null> {
  const magicItemsPack = game.packs?.get('D35E.magicitems');
  if (!magicItemsPack) {
    console.error("D35E.magicitems compendium not found!");
    return null;
  }
  
  try {
    const doc = await magicItemsPack.getDocument(itemId);
    if (doc) {
      return doc.toObject();
    }
  } catch (error) {
    console.error(`Failed to get item by ID ${itemId}:`, error);
  }
  
  return null;
}

/**
 * Add a metamagic rod to an actor from compendium
 */
export async function createMetamagicRod(
  actor: any,
  rodDef: MetamagicRodDefinition
): Promise<any | null> {
  console.log(`Adding metamagic rod: ${rodDef.name}`);
  
  const rodData = await getItemById(rodDef.id);
  
  if (rodData) {
    // Prepare the item
    const itemData = {
      ...rodData,
      system: {
        ...rodData.system,
        quantity: 1,
        identified: true,
        carried: true
      }
    };
    
    const created = await actor.createEmbeddedDocuments("Item", [itemData]);
    console.log(`✓ Added ${rodData.name}`);
    return created[0];
  }
  
  console.warn(`⚠ Rod "${rodDef.name}" (${rodDef.id}) not found in compendium - skipping`);
  return null;
}

/**
 * Add a staff to an actor from compendium
 */
export async function createStaff(
  actor: any,
  staffDef: StaffDefinition
): Promise<any | null> {
  console.log(`Adding staff: ${staffDef.name}`);
  
  const staffData = await getItemById(staffDef.id);
  
  if (staffData) {
    // Prepare the item with full charges
    const itemData = {
      ...staffData,
      system: {
        ...staffData.system,
        quantity: 1,
        identified: true,
        carried: true,
        equipped: false,
        uses: {
          ...staffData.system?.uses,
          value: staffDef.charges,
          max: staffDef.charges
        }
      }
    };
    
    const created = await actor.createEmbeddedDocuments("Item", [itemData]);
    console.log(`✓ Added ${staffData.name} (${staffDef.charges} charges)`);
    return created[0];
  }
  
  console.warn(`⚠ Staff "${staffDef.name}" (${staffDef.id}) not found in compendium - skipping`);
  return null;
}

/**
 * Add all selected rods and staff to an actor
 * 
 * @param actor The actor to add items to
 * @param rods Array of rod recommendations to add
 * @param staff Optional staff recommendation to add
 */
export async function addRodsAndStaffToActor(
  actor: any,
  rods: RodRecommendation[],
  staff: StaffRecommendation | null
): Promise<void> {
  console.log('\n=== ADDING RODS AND STAFF ===');
  
  // Add rods
  if (rods.length > 0) {
    console.log(`Adding ${rods.length} metamagic rod(s)...`);
    for (const rodRec of rods) {
      await createMetamagicRod(actor, rodRec.rod);
    }
  } else {
    console.log('No metamagic rods to add');
  }
  
  // Add staff
  if (staff) {
    console.log(`Adding staff: ${staff.staff.name}...`);
    await createStaff(actor, staff.staff);
  } else {
    console.log('No staff to add');
  }
  
  console.log('=== RODS AND STAFF COMPLETE ===\n');
}
