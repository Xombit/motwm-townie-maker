/**
 * Foundry VTT Console Script: Dump D35E Enhancements
 * 
 * PURPOSE: Extract all enhancement names, IDs, and key properties from the D35E compendium
 * 
 * HOW TO USE:
 * 1. Open Foundry VTT with D35E system
 * 2. Press F12 to open Developer Console
 * 3. Copy and paste this entire script
 * 4. Press Enter to execute
 * 5. Copy the JSON output and save it for the Townie Maker
 * 
 * WHAT IT EXPORTS:
 * - Enhancement ID (for referencing in code)
 * - Enhancement name
 * - Type (weapon/armor/shield)
 * - Enhancement bonus level cost (enhIncrease)
 * - Name extensions (prefix/suffix)
 * - Allowed item types (restrictions)
 * - Special effects (damage, DR, etc.)
 */

(async function dumpEnhancements() {
    console.log("=".repeat(80));
    console.log("D35E ENHANCEMENTS COMPENDIUM DUMP");
    console.log("=".repeat(80));
    
    // Get the enhancements compendium
    const pack = game.packs.get('D35E.enhancements');
    
    if (!pack) {
        console.error("ERROR: Could not find D35E.enhancements compendium!");
        console.error("Available packs:", Array.from(game.packs.keys()));
        return;
    }
    
    console.log(`Found compendium: ${pack.metadata.label} (${pack.index.size} items)`);
    console.log("Loading all enhancements...\n");
    
    // Load all documents from the compendium
    const documents = await pack.getDocuments();
    
    console.log(`Loaded ${documents.length} enhancements\n`);
    
    // Structure to hold categorized enhancements
    const enhancements = {
        weapons: {
            base: [],
            special: []
        },
        armor: {
            base: [],
            special: []
        },
        shields: {
            base: [],
            special: []
        },
        other: []
    };
    
    // Process each enhancement
    for (const doc of documents) {
        const data = doc.toObject();
        const sys = data.system;
        
        // Extract key information
        const enhancement = {
            id: data._id,
            name: data.name,
            type: sys.enhancementType || 'unknown',
            enhIncrease: sys.enhIncrease || 0,
            enhIsLevel: sys.enhIsLevel || false,
            nameExtension: {
                prefix: sys.nameExtension?.prefix || '',
                suffix: sys.nameExtension?.suffix || ''
            },
            allowedTypes: sys.allowedTypes || [],
            weaponData: sys.weaponData || null,
            damageReduction: sys.damageReduction || [],
            requirements: sys.requirements || '',
            attackNotes: sys.attackNotes || '',
            effectNotes: sys.effectNotes || '',
            description: data.system.description?.value || ''
        };
        
        // Categorize enhancement
        const type = enhancement.type;
        const isBase = enhancement.name.match(/^\+\d+\s+(Weapon|Armor|Shield)\s+Enhancement$/i);
        
        if (type === 'weapon') {
            if (isBase) {
                enhancements.weapons.base.push(enhancement);
            } else {
                enhancements.weapons.special.push(enhancement);
            }
        } else if (type === 'armor') {
            if (isBase) {
                enhancements.armor.base.push(enhancement);
            } else {
                enhancements.armor.special.push(enhancement);
            }
        } else if (type === 'shield') {
            if (isBase) {
                enhancements.shields.base.push(enhancement);
            } else {
                enhancements.shields.special.push(enhancement);
            }
        } else {
            enhancements.other.push(enhancement);
        }
    }
    
    // Sort each category by name
    const sortByName = (a, b) => a.name.localeCompare(b.name);
    enhancements.weapons.base.sort(sortByName);
    enhancements.weapons.special.sort(sortByName);
    enhancements.armor.base.sort(sortByName);
    enhancements.armor.special.sort(sortByName);
    enhancements.shields.base.sort(sortByName);
    enhancements.shields.special.sort(sortByName);
    enhancements.other.sort(sortByName);
    
    // Print summary
    console.log("=".repeat(80));
    console.log("SUMMARY");
    console.log("=".repeat(80));
    console.log(`Weapon Base Enhancements: ${enhancements.weapons.base.length}`);
    console.log(`Weapon Special Abilities: ${enhancements.weapons.special.length}`);
    console.log(`Armor Base Enhancements: ${enhancements.armor.base.length}`);
    console.log(`Armor Special Abilities: ${enhancements.armor.special.length}`);
    console.log(`Shield Base Enhancements: ${enhancements.shields.base.length}`);
    console.log(`Shield Special Abilities: ${enhancements.shields.special.length}`);
    console.log(`Other: ${enhancements.other.length}`);
    console.log("=".repeat(80));
    console.log("\n");
    
    // Print formatted lists for each category
    console.log("=".repeat(80));
    console.log("WEAPON BASE ENHANCEMENTS");
    console.log("=".repeat(80));
    enhancements.weapons.base.forEach(e => {
        console.log(`${e.name}`);
        console.log(`  ID: ${e.id}`);
        console.log(`  Bonus: +${e.enhIncrease}`);
        console.log("");
    });
    
    console.log("=".repeat(80));
    console.log("WEAPON SPECIAL ABILITIES");
    console.log("=".repeat(80));
    enhancements.weapons.special.forEach(e => {
        console.log(`${e.name}`);
        console.log(`  ID: ${e.id}`);
        console.log(`  Cost: +${e.enhIncrease} bonus levels`);
        console.log(`  Prefix: "${e.nameExtension.prefix}"`);
        console.log(`  Suffix: "${e.nameExtension.suffix}"`);
        if (e.allowedTypes.length > 0) {
            console.log(`  Restrictions: ${JSON.stringify(e.allowedTypes)}`);
        }
        if (e.weaponData?.damageRoll) {
            console.log(`  Extra Damage: ${e.weaponData.damageRoll} ${e.weaponData.damageType}`);
        }
        if (e.attackNotes) {
            console.log(`  Effect: ${e.attackNotes.substring(0, 100)}...`);
        }
        console.log("");
    });
    
    console.log("=".repeat(80));
    console.log("ARMOR BASE ENHANCEMENTS");
    console.log("=".repeat(80));
    enhancements.armor.base.forEach(e => {
        console.log(`${e.name}`);
        console.log(`  ID: ${e.id}`);
        console.log(`  Bonus: +${e.enhIncrease}`);
        console.log("");
    });
    
    console.log("=".repeat(80));
    console.log("ARMOR SPECIAL ABILITIES");
    console.log("=".repeat(80));
    enhancements.armor.special.forEach(e => {
        console.log(`${e.name}`);
        console.log(`  ID: ${e.id}`);
        console.log(`  Cost: +${e.enhIncrease} bonus levels`);
        console.log(`  Prefix: "${e.nameExtension.prefix}"`);
        console.log(`  Suffix: "${e.nameExtension.suffix}"`);
        if (e.damageReduction.length > 0) {
            console.log(`  DR: ${e.damageReduction.map(dr => `${dr[0]}/${dr[1]}`).join(', ')}`);
        }
        if (e.effectNotes) {
            console.log(`  Effect: ${e.effectNotes.substring(0, 100)}...`);
        }
        console.log("");
    });
    
    console.log("=".repeat(80));
    console.log("SHIELD ENHANCEMENTS");
    console.log("=".repeat(80));
    console.log(`Base: ${enhancements.shields.base.length}`);
    console.log(`Special: ${enhancements.shields.special.length}`);
    console.log("");
    
    // Export as JSON for easy import into code
    console.log("=".repeat(80));
    console.log("JSON EXPORT (Copy this into a file)");
    console.log("=".repeat(80));
    console.log(JSON.stringify(enhancements, null, 2));
    
    // Also create a simplified lookup object
    console.log("\n");
    console.log("=".repeat(80));
    console.log("SIMPLIFIED LOOKUP OBJECT (For TypeScript)");
    console.log("=".repeat(80));
    
    const lookup = {
        weapon: {
            base: enhancements.weapons.base.map(e => ({ id: e.id, name: e.name, bonus: e.enhIncrease })),
            flaming: enhancements.weapons.special.find(e => e.name === 'Flaming'),
            frost: enhancements.weapons.special.find(e => e.name === 'Frost'),
            shock: enhancements.weapons.special.find(e => e.name === 'Shock'),
            keen: enhancements.weapons.special.find(e => e.name === 'Keen'),
            vorpal: enhancements.weapons.special.find(e => e.name === 'Vorpal'),
            holy: enhancements.weapons.special.find(e => e.name === 'Holy'),
            unholy: enhancements.weapons.special.find(e => e.name === 'Unholy')
        },
        armor: {
            base: enhancements.armor.base.map(e => ({ id: e.id, name: e.name, bonus: e.enhIncrease })),
            invulnerability: enhancements.armor.special.find(e => e.name === 'Invulnerability'),
            shadow: enhancements.armor.special.find(e => e.name === 'Shadow'),
            slick: enhancements.armor.special.find(e => e.name === 'Slick')
        }
    };
    
    console.log(JSON.stringify(lookup, null, 2));
    
    console.log("\n");
    console.log("=".repeat(80));
    console.log("DONE! Copy the JSON output above.");
    console.log("=".repeat(80));
    
    return enhancements;
})();
