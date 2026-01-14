// D35E System Adapter - Helper functions for interacting with D35E system

// Supported races - must have matching image folders
// Names must match D35E compendium exactly (e.g., "Elf, High" not "Elf")
const SUPPORTED_RACES: Array<{ id: string; name: string }> = [
  // Humans
  { id: "human", name: "Human" },
  // Elves (subraces)
  { id: "elf-high", name: "Elf, High" },
  { id: "elf-wood", name: "Elf, Wood" },
  { id: "elf-drow", name: "Elf, Drow" },
  // Dwarves (subraces)
  { id: "dwarf-hill", name: "Dwarf, Hill" },
  { id: "dwarf-mountain", name: "Dwarf, Mountain" },
  // Gnomes (subraces)
  { id: "gnome-rock", name: "Gnome, Rock" },
  // Halflings (subraces)
  { id: "halfling-lightfoot", name: "Halfling, Lightfoot" },
  // Half-breeds
  { id: "half-elf", name: "Half-Elf" },
  { id: "half-orc", name: "Half-Orc" },
  // Planetouched
  { id: "aasimar", name: "Aasimar" },
  { id: "tiefling", name: "Tiefling" },
];

// Supported classes - must have matching image folders
const SUPPORTED_CLASSES: Array<{ id: string; name: string }> = [
  // Core Martial
  { id: "fighter", name: "Fighter" },
  { id: "barbarian", name: "Barbarian" },
  { id: "monk", name: "Monk" },
  { id: "paladin", name: "Paladin" },
  { id: "ranger", name: "Ranger" },
  { id: "rogue", name: "Rogue" },
  // Core Casters
  { id: "bard", name: "Bard" },
  { id: "cleric", name: "Cleric" },
  { id: "druid", name: "Druid" },
  { id: "sorcerer", name: "Sorcerer" },
  { id: "wizard", name: "Wizard" },
  // NPC Classes
  { id: "adept", name: "Adept (NPC)" },
  { id: "aristocrat", name: "Aristocrat (NPC)" },
  { id: "commoner", name: "Commoner (NPC)" },
  { id: "expert", name: "Expert (NPC)" },
  { id: "warrior", name: "Warrior (NPC)" },
];

export class D35EAdapter {
  /**
   * D35E git builds can crash during actor updates if system.traits.tokenSize is unset
   * and the system tries to resolve a missing CONFIG.D35E.tokenSizes["actor"].
   *
   * This keeps tokenSize pinned to the actor's current size key (e.g. "med", "sm").
   */
  static async ensureTokenSizeIsSet(actor: Actor): Promise<void> {
    const traits = (actor as any)?.system?.traits;
    const currentTokenSize: string | undefined = traits?.tokenSize;
    const actorSize: string | undefined = traits?.size;

    let desired = currentTokenSize;
    if (!desired || desired === "actor") {
      desired = actorSize || "med";
    }

    const tokenSizes = (CONFIG as any)?.D35E?.tokenSizes;
    if (tokenSizes && desired && !tokenSizes[desired]) {
      desired = "med";
    }

    if (desired && desired !== currentTokenSize) {
      await actor.update({ "system.traits.tokenSize": desired });
      console.log(`D35EAdapter | Set tokenSize to '${desired}' for ${actor.name}`);
    }
  }

  /**
   * Get available races (hardcoded to those with image support)
   */
  static async getRaces(): Promise<Array<{ id: string; name: string }>> {
    return SUPPORTED_RACES;
  }

  /**
   * Get available classes (hardcoded to those with image support)
   */
  static async getClasses(): Promise<Array<{ id: string; name: string }>> {
    return SUPPORTED_CLASSES;
  }

  /**
   * Get available feats from the system
   */
  static async getFeats(): Promise<Array<{ id: string; name: string }>> {
    const feats: Array<{ id: string; name: string }> = [];
    
    // Try to get from compendiums
    const featPacks = game.packs?.filter(p => 
      p.metadata.type === "Item" && 
      p.metadata.label?.toLowerCase().includes("feat")
    );
    
    if (featPacks) {
      for (const pack of featPacks) {
        const content = await pack.getDocuments();
        for (const item of content) {
          if ((item as any).type === "feat") {
            feats.push({ id: item.id!, name: item.name! });
          }
        }
      }
    }
    
    return feats;
  }

  /**
   * Create a new character/NPC actor
   */
  static async createActor(data: {
    name: string;
    type: "character" | "npc";
    folder?: string;
    img?: string;           // Portrait image path
    tokenImg?: string;      // Token image path
    tokenDisposition?: number;  // -1 = Hostile, 0 = Neutral, 1 = Friendly
  }): Promise<Actor | null> {
    // Find or create folder
    let folderId: string | undefined;
    if (data.folder) {
      let folder = game.folders?.find(f => 
        f.type === "Actor" && f.name === data.folder
      );
      
      if (!folder) {
        folder = await Folder.create({
          name: data.folder,
          type: "Actor",
          parent: null
        }) as Folder;
      }
      
      folderId = folder?.id;
    }

    // Use provided images or fall back to defaults
    const portraitImg = data.img || "icons/svg/mystery-man.svg";
    const tokenImg = data.tokenImg || portraitImg;
    
    // Use provided disposition or default to Neutral (0)
    const disposition = data.tokenDisposition ?? 0;

    // Create the actor with portrait and token images.
    // Also set a safe default for D35E's token sizing to avoid D35E git-build crashes
    // when CONFIG.D35E.tokenSizes["actor"] is missing.
    const actor = await Actor.create({
      name: data.name,
      type: data.type,
      folder: folderId,
      img: portraitImg,
      system: {
        traits: {
          tokenSize: "med"
        }
      } as any,
      prototypeToken: {
        texture: {
          src: tokenImg
        },
        disposition: disposition
      }
    });

    return actor as Actor;
  }

  /**
   * Set ability scores on an actor
   */
  static async setAbilityScores(
    actor: Actor, 
    scores: { str: number; dex: number; con: number; int: number; wis: number; cha: number }
  ): Promise<void> {
    await actor.update({
      "system.abilities.str.value": scores.str,
      "system.abilities.dex.value": scores.dex,
      "system.abilities.con.value": scores.con,
      "system.abilities.int.value": scores.int,
      "system.abilities.wis.value": scores.wis,
      "system.abilities.cha.value": scores.cha
    });
  }

  /**
   * Set the token image for an actor
   * This should be called AFTER all other updates to prevent D35E from overwriting it
   * Sets both prototypeToken.texture.src (Foundry standard) and system.tokenImg (D35E specific)
   */
  static async setTokenImage(actor: Actor, tokenImg: string): Promise<void> {
    console.log(`D35EAdapter | Setting token image to: ${tokenImg}`);
    await actor.update({
      "prototypeToken.texture.src": tokenImg,
      "system.tokenImg": tokenImg  // D35E uses this field for token image
    });
  }

  /**
   * Set the NPC's level directly (for Simple NPC sheet)
   * Unlike PC sheets which track level via class progression, NPC sheets have a simple level value
   * Also sets the CR to match the level
   */
  static async setNpcLevel(actor: Actor, level: number): Promise<void> {
    console.log(`D35EAdapter | Setting NPC level to: ${level}, CR to: ${level}`);
    
    await actor.update({
      "system.details.level.value": level,
      "system.details.cr": level
    });
  }

  /**
   * Update the class item's level value on an NPC
   * This sets the system.levels field on the class item itself (note: plural "levels")
   * The D35E system derives system.classes.<classname>.level from cls.system.levels
   */
  static async updateNpcClassItemLevel(actor: Actor, className: string, level: number): Promise<void> {
    // Find the class item on the actor
    const classItem = actor.items?.find((i: any) => 
      i.type === 'class' && i.name.toLowerCase() === className.toLowerCase()
    );
    
    if (classItem) {
      console.log(`D35EAdapter | Updating class item ${className} levels to: ${level}`);
      await classItem.update({ "system.levels": level });
    } else {
      console.warn(`D35EAdapter | Could not find class item ${className} to update level`);
    }
  }

  /**
   * Set the NPC's HP directly (for Simple NPC sheet)
   * Sets hp.value and hp.max on the actor
   */
  static async setNpcHP(actor: Actor, hp: number): Promise<void> {
    console.log(`D35EAdapter | Setting NPC HP to: ${hp}`);
    
    await actor.update({
      "system.attributes.hp.value": hp,
      "system.attributes.hp.max": hp
    });
  }

  /**
   * Update the class item's HP value on an NPC
   * This sets the system.hp field on the class item itself
   */
  static async updateNpcClassItemHP(actor: Actor, className: string, hp: number): Promise<void> {
    // Find the class item on the actor
    const classItem = actor.items?.find((i: any) => 
      i.type === 'class' && i.name.toLowerCase() === className.toLowerCase()
    );
    
    if (classItem) {
      console.log(`D35EAdapter | Updating class item ${className} HP to: ${hp}`);
      await classItem.update({ "system.hp": hp });
    } else {
      console.warn(`D35EAdapter | Could not find class item ${className} to update HP`);
    }
  }

  /**
   * Calculate and set HP for a Simple NPC based on class hit die
   * Rolls HD x level and adds CON modifier x level
   * Also updates the class item's HP for proper display
   */
  static async calculateAndSetNpcHP(
    actor: Actor, 
    level: number, 
    hitDie: number,
    conModifier: number,
    useMaxHp: boolean = false,
    className?: string
  ): Promise<number> {
    const rolls: number[] = [];
    
    for (let lvl = 1; lvl <= level; lvl++) {
      let hpRoll: number;
      
      if (useMaxHp || lvl === 1) {
        // Max HP per level OR first level: max HD
        hpRoll = hitDie;
      } else {
        // Random roll for other levels (minimum 1)
        hpRoll = Math.max(1, Math.floor(Math.random() * hitDie) + 1);
      }
      
      rolls.push(hpRoll);
    }
    
    const totalHP = rolls.reduce((sum, r) => sum + r, 0) + (conModifier * level);
    const finalHP = Math.max(totalHP, 1); // Minimum 1 HP
    
    console.log(`D35EAdapter | NPC HP calculation: HD ${hitDie} x ${level} levels = ${rolls.join('+')} + (CON mod ${conModifier} x ${level}) = ${finalHP}${useMaxHp ? ' (MAX HP)' : ''}`);
    
    // Set the actor's HP values
    await this.setNpcHP(actor, finalHP);
    
    // Also update the class item's HP for proper display on the sheet
    if (className) {
      await this.updateNpcClassItemHP(actor, className, finalHP);
    }
    
    return finalHP;
  }

  /**
   * Add a class to an NPC sheet (item only, no progression tracking)
   * For Simple NPC sheets, the class is just an item - level is tracked separately
   */
  static async addNpcClass(actor: Actor, className: string, level: number): Promise<number> {
    // Import hardcoded IDs
    const { getClassId } = await import('./data/compendium-ids');
    
    try {
      // Get class compendium
      const pack = game.packs?.get('D35E.classes');
      if (!pack) {
        throw new Error("Class compendium 'D35E.classes' not found");
      }

      // Try hardcoded ID first (fast path)
      const classId = getClassId(className);
      let classDoc: any = null;
      
      if (classId) {
        // Direct lookup by ID - fast!
        classDoc = await pack.getDocument(classId);
        if (classDoc) {
          console.log(`D35EAdapter | Found class ${className} by ID for NPC`);
        }
      }
      
      // Fallback: Find class by name (slow path for unknown classes)
      if (!classDoc) {
        console.warn(`D35EAdapter | Class '${className}' not in hardcoded IDs for NPC, falling back to name lookup`);
        const index = await pack.getIndex();
        const classEntry = index.find((i: any) => i.name === className);
        
        if (!classEntry) {
          throw new Error(`Class '${className}' not found in compendium`);
        }

        classDoc = await pack.getDocument(classEntry._id);
      }
      
      if (!classDoc) {
        throw new Error(`Failed to load class document for '${className}'`);
      }

      // Get the hit die from the class
      const hitDie = classDoc.system.hd || 8;

      // Add class to actor as item (for NPC sheet, just add it - no level tracking)
      const classData = classDoc.toObject();
      // Set the level on the class item itself (note: plural "levels" for D35E)
      classData.system.levels = level;
      await actor.createEmbeddedDocuments('Item', [classData]);

      console.log(`D35EAdapter | Added class ${className} to NPC ${actor.name} (HD: d${hitDie})`);
      
      // Set the NPC's level value on the actor
      await this.setNpcLevel(actor, level);
      
      // Update the class item's level (D35E derives system.classes.X.level from this)
      await this.updateNpcClassItemLevel(actor, className, level);
      
      return hitDie;
    } catch (error) {
      console.error(`D35EAdapter | Failed to add NPC class ${className}:`, error);
      throw error;
    }
  }

  /**
   * Add skills to an NPC sheet (direct point assignment, no levelUpData)
   * For Simple NPC sheets, we just set the `points` value on each skill
   * D35E will automatically calculate rank (class skills get full points, cross-class half)
   * 
   * @param actor The actor to add skills to
   * @param level The character level (for max rank calculation)
   * @param skillList Array of skills with priorities
   */
  static async addNpcSkills(
    actor: Actor,
    level: number,
    skillList: Array<{ name: string; ranks: number; priority?: "high" | "medium" | "low" }>
  ): Promise<void> {
    try {
      if (!skillList || skillList.length === 0) {
        return;
      }

      // Get class info for skill points and class skills
      const classItem = actor.items?.find((i: any) => i.type === "class");
      if (!classItem) {
        console.warn(`D35EAdapter | No class found for NPC skill calculation`);
        return;
      }
      
      const classSkills = (classItem as any).system.classSkills || {};
      const baseSkillPoints = (classItem as any).system.skillsPerLevel || 2;
      const intMod = (actor as any).system.abilities?.int?.mod || 0;
      
      // Total skill points for NPC: (base + INT) × level
      // Note: NPCs don't get the x4 at 1st level that PCs do
      const totalSkillPoints = (baseSkillPoints + intMod) * level;
      
      // Max ranks: class skills = level + 3, cross-class = (level + 3) / 2
      const maxClassRanks = level + 3;
      const maxCrossClassRanks = Math.floor((level + 3) / 2);
      
      console.log(`D35EAdapter | NPC Skills: ${totalSkillPoints} total points, max ranks: ${maxClassRanks} (class) / ${maxCrossClassRanks} (cross-class)`);
      
      // Group skills by priority
      const highPriority = skillList.filter(s => s.priority === 'high');
      const mediumPriority = skillList.filter(s => s.priority === 'medium');
      const lowPriority = skillList.filter(s => s.priority === 'low');
      
      // Calculate points to allocate based on priority weights
      // High = 4 weight, Medium = 2 weight, Low = 1 weight
      const totalWeight = (highPriority.length * 4) + (mediumPriority.length * 2) + (lowPriority.length * 1);
      const pointsPerWeight = totalWeight > 0 ? totalSkillPoints / totalWeight : 0;
      
      // Build the skill update object
      const skillUpdates: any = {};
      let pointsSpent = 0;
      
      // Helper to calculate points for a skill
      const allocateSkillPoints = (skillName: string, weight: number) => {
        // Handle subskills (format: "crf1:Weaponsmithing")
        let skillKey: string;
        let subSkillName: string | null = null;
        
        if (skillName.includes(':')) {
          const [subSkillId, customName] = skillName.split(':');
          skillKey = subSkillId.substring(0, 3);
          subSkillName = customName;
        } else {
          skillKey = skillName;
        }
        
        // Check if it's a class skill
        const isClassSkill = classSkills[skillKey] === true;
        const maxRanks = isClassSkill ? maxClassRanks : maxCrossClassRanks;
        
        // Calculate raw points based on weight
        let rawPoints = Math.round(pointsPerWeight * weight);
        
        // For cross-class skills, we need to spend 2 points per rank
        // So if we want N ranks, we spend N*2 points
        // For class skills, 1 point = 1 rank
        
        // Clamp to max ranks
        let targetRanks = Math.min(rawPoints, maxRanks);
        
        // If cross-class, actual points spent is double the ranks
        let actualPointsSpent = isClassSkill ? targetRanks : targetRanks * 2;
        
        // For cross-class, we set points = 2 * targetRanks so D35E calculates rank = points/2 = targetRanks
        // For class skills, points = targetRanks
        const pointsToSet = isClassSkill ? targetRanks : targetRanks * 2;
        
        if (subSkillName) {
          // Subskill (Craft, Profession, Perform)
          // Need to create or update the subskill
          console.log(`D35EAdapter | Subskills not yet supported for NPCs: ${skillName}`);
        } else {
          skillUpdates[`system.skills.${skillKey}.points`] = pointsToSet;
          console.log(`D35EAdapter | NPC Skill ${skillKey}: ${pointsToSet} points -> ${targetRanks} ranks (${isClassSkill ? 'class' : 'cross-class'})`);
        }
        
        return actualPointsSpent;
      };
      
      // Allocate points by priority
      for (const skill of highPriority) {
        pointsSpent += allocateSkillPoints(skill.name, 4);
      }
      for (const skill of mediumPriority) {
        pointsSpent += allocateSkillPoints(skill.name, 2);
      }
      for (const skill of lowPriority) {
        pointsSpent += allocateSkillPoints(skill.name, 1);
      }
      
      console.log(`D35EAdapter | NPC Skills: Spent ${pointsSpent}/${totalSkillPoints} skill points`);
      
      // Apply all skill updates at once
      if (Object.keys(skillUpdates).length > 0) {
        await actor.update(skillUpdates);
        console.log(`D35EAdapter | Applied NPC skill updates:`, skillUpdates);
      }
      
    } catch (error) {
      console.error(`D35EAdapter | Failed to add NPC skills:`, error);
    }
  }

  /**
   * Add a race to an actor using hardcoded compendium ID
   */
  static async addRace(actor: Actor, raceName: string): Promise<void> {
    // Import hardcoded IDs
    const { getRaceId } = await import('./data/compendium-ids');
    
    try {
      // Get race compendium
      const pack = game.packs?.get('D35E.racialfeatures');
      if (!pack) {
        throw new Error("Race compendium 'D35E.racialfeatures' not found");
      }

      // Try hardcoded ID first (fast path)
      const raceId = getRaceId(raceName);
      
      if (raceId) {
        // Direct lookup by ID - fast!
        const raceDoc = await pack.getDocument(raceId);
        if (raceDoc) {
          await actor.createEmbeddedDocuments('Item', [raceDoc.toObject()]);
          console.log(`D35EAdapter | Added race ${raceName} to ${actor.name} (by ID)`);
          await D35EAdapter.ensureTokenSizeIsSet(actor);
          return;
        }
      }

      // Fallback: Find race by name (slow path for unknown races)
      console.warn(`D35EAdapter | Race '${raceName}' not in hardcoded IDs, falling back to name lookup`);
      const index = await pack.getIndex();
      const raceEntry = index.find((i: any) => i.name === raceName);
      
      if (!raceEntry) {
        throw new Error(`Race '${raceName}' not found in compendium`);
      }

      // Get full race document
      const raceDoc = await pack.getDocument(raceEntry._id);
      if (!raceDoc) {
        throw new Error(`Failed to load race document for '${raceName}'`);
      }

      // Add to actor
      await actor.createEmbeddedDocuments('Item', [raceDoc.toObject()]);
      console.log(`D35EAdapter | Added race ${raceName} to ${actor.name} (by name)`);
      await D35EAdapter.ensureTokenSizeIsSet(actor);
    } catch (error) {
      console.error(`D35EAdapter | Failed to add race ${raceName}:`, error);
      throw error;
    }
  }

  /**
   * Set biography with optional personality and background sections
   */
  static async setBiography(
    actor: Actor,
    options: { personality?: string; background?: string }
  ): Promise<void> {
    const sections: string[] = [];

    if (options.personality) {
      sections.push(`<h2>Personality</h2><p>${options.personality}</p>`);
    }

    if (options.background) {
      sections.push(`<h2>Background</h2><p>${options.background}</p>`);
    }

    if (sections.length > 0) {
      const biography = sections.join('\n');
      await actor.update({
        "system.details.biography.value": biography
      });
      console.log(`D35EAdapter | Set biography for ${actor.name}`);
    }
  }

  /**
   * Add feats to an actor based on level
   * Feats are granted at level 1, 3, 6, 9, 12, 15, 18
   * Humans get +1 bonus feat at level 1
   * 
   * @param featList - Array of feat names (strings) or FeatAllocation objects with {feat, level, source}
   */
  static async addFeats(actor: Actor, level: number, featList: Array<string | any>, isHuman: boolean = false): Promise<void> {
    try {
      // If featList contains allocation objects (with level and source), use them directly
      // Otherwise, calculate feat progression for backward compatibility
      let featsToAdd: Array<{feat: string | any, level: number, source?: string}>;
      
      if (featList.length > 0 && featList[0].level !== undefined) {
        // Already have allocations with levels
        featsToAdd = featList as Array<{feat: string | any, level: number, source?: string}>;
      } else {
        // Legacy mode: Calculate feat progression
        const featLevels: number[] = [1]; // Everyone gets a feat at level 1
        for (let lvl = 3; lvl <= level; lvl += 3) {
          featLevels.push(lvl);
        }
        
        // Humans get bonus feat at level 1
        if (isHuman) {
          featLevels.push(1); // Add another level 1 feat
        }
        
        // Sort to ensure level 1 feats come first
        featLevels.sort((a, b) => a - b);
        
        // Get only the feats they should have at this level and wrap in allocation objects
        const featsSlice = featList.slice(0, featLevels.length);
        featsToAdd = featsSlice.map((feat, index) => ({
          feat,
          level: featLevels[index]
        }));
      }
      
      if (featsToAdd.length === 0) {
        return;
      }

      // Try to get feats from compendiums
      const featPacks = game.packs?.filter(p => 
        p.metadata.type === "Item" && 
        p.metadata.label?.toLowerCase().includes("feat")
      );

      if (!featPacks || featPacks.length === 0) {
        console.warn(`D35EAdapter | No feat compendiums found`);
        return;
      }

      const featsToCreate: any[] = [];

      for (let i = 0; i < featsToAdd.length; i++) {
        const allocation = featsToAdd[i];
        const featAddedAtLevel = allocation.level;
        const source = allocation.source; // 'ranger-style', 'class', 'general', etc.
        
        // Extract feat info (could be string or object)
        const featEntry = allocation.feat;
        
        // Handle both string and FeatConfig object formats
        const featConfig = typeof featEntry === 'string' 
          ? { name: featEntry, displayName: featEntry } 
          : featEntry;
        
        const featName = featConfig.name;
        let found = false;

        for (const pack of featPacks) {
          const content = await pack.getDocuments();
          const featDoc = content.find((i: any) => i.name === featName);

          if (featDoc) {
            const featData = featDoc.toObject();
            
            // Apply configuration if provided
            if (featConfig.config) {
              // Handle Spell Focus / Greater Spell Focus
              if (featConfig.config.spellSchool && featData.system?.customAttributes?._6zv0nkvei) {
                featData.system.customAttributes._6zv0nkvei.value = featConfig.config.spellSchool;
                
                // Map spell school codes to display names
                const schoolNames: Record<string, string> = {
                  'abj': 'Abjuration',
                  'con': 'Conjuration',
                  'div': 'Divination',
                  'enc': 'Enchantment',
                  'evo': 'Evocation',
                  'ill': 'Illusion',
                  'nec': 'Necromancy',
                  'trs': 'Transmutation'
                };
                
                const schoolName = schoolNames[featConfig.config.spellSchool] || featConfig.config.spellSchool;
                const featBaseName = featName.includes('Greater') ? 'Greater Spell Focus' : 'Spell Focus';
                featData.name = `${featBaseName} (${schoolName})`;
                featData.system.identifiedName = featData.name;
                
                console.log(`D35EAdapter | Configured ${featData.name}`);
              }
              
              // Handle Weapon-based feats (Focus, Specialization, Improved Critical, Greater Weapon Focus, etc.)
              if (featConfig.config.weaponGroup && featData.system?.customAttributes) {
                // Find the weapon attribute by looking for "Weapon Name" field
                for (const [key, attr] of Object.entries(featData.system.customAttributes)) {
                  if ((attr as any).name === 'Weapon Name') {
                    (featData.system.customAttributes as any)[key].value = featConfig.config.weaponGroup;
                    
                    // Directly set the feat name (formulas don't resolve during creation)
                    // Remove any existing parenthetical (e.g., "(No Weapon Selected)")
                    const baseFeatName = featName.replace(/\s*\([^)]*\)\s*$/, '');
                    featData.name = `${baseFeatName} (${featConfig.config.weaponGroup})`;
                    featData.system.identifiedName = featData.name;
                    
                    console.log(`D35EAdapter | Configured ${featData.name}`);
                    break;
                  }
                }
              }
              
              // Handle Skill Focus (uses changes array structure)
              if (featConfig.config.skill && featData.system?.changes) {
                console.log(`D35EAdapter | Configuring Skill Focus with skill: ${featConfig.config.skill}`);
                
                if (featData.system.changes.length > 0 && Array.isArray(featData.system.changes[0])) {
                  const skillConfig = featConfig.config.skill;
                  
                  console.log(`D35EAdapter | Original changes[0]: ${JSON.stringify(featData.system.changes[0])}`);
                  
                  // Check if this is a subskill (format: "prf1:Sing")
                  if (skillConfig.includes(':')) {
                    const [subSkillId, customName] = skillConfig.split(':');
                    const baseSkill = subSkillId.substring(0, 3); // "crf", "pro", "prf"
                    
                    // Map skill code to display name
                    const skillDisplayNames: Record<string, string> = {
                      'prf': 'Perform',
                      'crf': 'Craft',
                      'pro': 'Profession'
                    };
                    const baseSkillName = skillDisplayNames[baseSkill] || baseSkill;
                    
                    // Set the skill target path in changes array (index 2)
                    const targetPath = `skill.${baseSkill}.subSkills.${subSkillId}`;
                    featData.system.changes[0][2] = targetPath;
                    
                    // Set the feat name directly (D35E formula doesn't resolve during creation)
                    const displayName = `${baseSkillName} (${customName})`;
                    featData.name = `Skill Focus (${displayName})`;
                    featData.system.identifiedName = featData.name;
                    
                    console.log(`D35EAdapter | Configured Skill Focus: ${featData.name}`);
                    console.log(`D35EAdapter | Changes path: ${targetPath}`);
                  } else if (skillConfig.startsWith('crf') || skillConfig.startsWith('pro') || skillConfig.startsWith('prf')) {
                    // Subskill ID without custom name
                    const baseSkill = skillConfig.substring(0, 3);
                    featData.system.changes[0][2] = `skill.${baseSkill}.subSkills.${skillConfig}`;
                    console.log(`D35EAdapter | Configured Skill Focus with subskill: ${skillConfig}`);
                  } else {
                    // Regular skill (not a subskill)
                    featData.system.changes[0][2] = `skill.${skillConfig}`;
                    console.log(`D35EAdapter | Configured Skill Focus with skill: ${skillConfig}`);
                  }
                } else {
                  console.warn(`D35EAdapter | Skill Focus feat missing changes array`);
                }
              }
            }
            
            // Set the level at which this feat was added
            featData.system.addedLevel = featAddedAtLevel;
            
            // Set classSource for class bonus feats
            if (source === 'ranger-style') {
              featData.system.classSource = 'ranger';
              console.log(`D35EAdapter | Set classSource 'ranger' for combat style feat: ${featName}`);
            } else if (source === 'fighter') {
              featData.system.classSource = 'fighter';
              console.log(`D35EAdapter | Set classSource 'fighter' for bonus feat: ${featName}`);
            } else if (source === 'wizard') {
              featData.system.classSource = 'wizard';
              console.log(`D35EAdapter | Set classSource 'wizard' for bonus feat: ${featName}`);
            } else if (source === 'monk') {
              featData.system.classSource = 'monk';
              console.log(`D35EAdapter | Set classSource 'monk' for bonus feat: ${featName}`);
            }
            
            featsToCreate.push(featData);
            found = true;
            break;
          }
        }

        if (!found) {
          console.warn(`D35EAdapter | Feat '${featName}' not found in compendiums`);
        }
      }

      if (featsToCreate.length > 0) {
        await actor.createEmbeddedDocuments('Item', featsToCreate);
        console.log(`D35EAdapter | Added ${featsToCreate.length} feats to ${actor.name}`);
      }
    } catch (error) {
      console.error(`D35EAdapter | Failed to add feats:`, error);
    }
  }

  /**
   * Add Ranger favored enemies to an actor
   * 
   * @param actor The actor to add favored enemies to
   * @param level Ranger level
   * @param enemyTypes Array of enemy types from template (in order of preference)
   */
  static async addFavoredEnemies(
    actor: Actor,
    level: number,
    enemyTypes: string[]
  ): Promise<void> {
    try {
      const { calculateFavoredEnemies } = await import('./data/favored-enemy');
      
      // Find existing favored enemy feats (added by the Ranger class)
      const favoredEnemyFeats = actor.items.filter((item: any) => 
        item.type === 'feat' && 
        item.system?.uniqueId?.startsWith('rng-fav-Ranger-')
      ).sort((a: any, b: any) => {
        // Sort by the level they were gained (from uniqueId: rng-fav-Ranger-1, rng-fav-Ranger-5, etc.)
        const aLevel = parseInt(a.system.uniqueId.split('-').pop() || '0');
        const bLevel = parseInt(b.system.uniqueId.split('-').pop() || '0');
        return aLevel - bLevel;
      });

      console.log(`D35EAdapter | Found ${favoredEnemyFeats.length} favored enemy feats to configure`);

      // Calculate which favored enemies the ranger should have
      const configs = calculateFavoredEnemies(level, enemyTypes);
      
      console.log(`D35EAdapter | Configuring ${configs.length} favored enemies for ${actor.name}:`);
      configs.forEach(cfg => {
        const bonus = cfg.level * 2;
        console.log(`  - ${cfg.type}: +${bonus} (gained at level ${cfg.gainedAtLevel}, boost level ${cfg.level})`);
      });

      // Update each existing feat with the proper enemy type and boost level
      const updates = [];
      for (let i = 0; i < Math.min(configs.length, favoredEnemyFeats.length); i++) {
        const feat = favoredEnemyFeats[i];
        const config = configs[i];
        const bonus = config.level * 2;
        const newName = `Favored Enemy (${config.type}, +${bonus})`;
        
        updates.push({
          _id: feat.id,
          name: newName,
          'system.customAttributes._o3zfw6g43.value': config.type,
          'system.customAttributes._ar55qs0iq.value': config.level.toString()
        });
      }

      if (updates.length > 0) {
        await actor.updateEmbeddedDocuments('Item', updates);
        console.log(`D35EAdapter | Successfully configured ${updates.length} favored enemies`);
      }
    } catch (error) {
      console.error(`D35EAdapter | Failed to configure favored enemies:`, error);
      throw error;
    }
  }

  /**
   * Add Rogue special abilities to an actor
   * Rogues get special abilities at 10th, 13th, 16th, and 19th levels
   */
  static async addRogueSpecialAbilities(
    actor: Actor,
    level: number,
    specialAbilities: string[]
  ): Promise<void> {
    try {
      const { getRogueSpecialAbilityLevels } = await import('./data/feat-selection');
      
      const abilityLevels = getRogueSpecialAbilityLevels(level);
      const abilitiesToAdd = specialAbilities.slice(0, abilityLevels.length);
      
      if (abilitiesToAdd.length === 0) {
        return;
      }

      // Find the class-abilities compendium
      const pack = game.packs?.get('D35E.class-abilities');
      if (!pack) {
        console.warn(`D35EAdapter | class-abilities compendium not found`);
        return;
      }

      const abilitiesToCreate: any[] = [];

      for (let i = 0; i < abilitiesToAdd.length; i++) {
        const abilityName = abilitiesToAdd[i];
        const addedAtLevel = abilityLevels[i];

        // Search for the ability in the compendium
        const content = await pack.getDocuments();
        const abilityDoc = content.find((item: any) => item.name === abilityName);

        if (abilityDoc) {
          const abilityData = abilityDoc.toObject();
          abilityData.system.addedLevel = addedAtLevel;
          
          abilitiesToCreate.push(abilityData);
          console.log(`D35EAdapter | Adding Rogue special ability: ${abilityName} (level ${addedAtLevel})`);
        } else {
          console.warn(`D35EAdapter | Rogue special ability '${abilityName}' not found in class-abilities compendium`);
        }
      }

      if (abilitiesToCreate.length > 0) {
        await actor.createEmbeddedDocuments('Item', abilitiesToCreate);
        console.log(`D35EAdapter | Added ${abilitiesToCreate.length} Rogue special abilities to ${actor.name}`);
      }
    } catch (error) {
      console.error(`D35EAdapter | Failed to add Rogue special abilities:`, error);
      throw error;
    }
  }

  /**
   * Add spells to an actor (for caster classes)
   * Configures spellbook and adds appropriate spells from compendium
   */
  static async addSpells(
    actor: Actor,
    className: string,
    level: number,
    abilities: { str: number; dex: number; con: number; int: number; wis: number; cha: number }
  ): Promise<void> {
    try {
      const { configureSpellsForActor } = await import('./data/spell-configuration');
      await configureSpellsForActor(actor, className, level, abilities);
    } catch (error) {
      console.error(`D35EAdapter | Failed to add spells:`, error);
      throw error;
    }
  }

  /**
   * Add a class to an actor using hardcoded compendium ID
   */
  static async addClass(actor: Actor, className: string, level: number): Promise<void> {
    // Import hardcoded IDs
    const { getClassId } = await import('./data/compendium-ids');
    
    try {
      // XP thresholds for levels 1-20 (D&D 3.5e SRD)
      // These are the MINIMUM XP needed to reach each level
      const xpThresholds = [
        0,      // Level 1
        1000,   // Level 2
        3000,   // Level 3
        6000,   // Level 4
        10000,  // Level 5
        15000,  // Level 6
        21000,  // Level 7
        28000,  // Level 8
        36000,  // Level 9
        45000,  // Level 10
        55000,  // Level 11
        66000,  // Level 12
        78000,  // Level 13
        91000,  // Level 14
        105000, // Level 15
        120000, // Level 16
        136000, // Level 17
        153000, // Level 18
        171000, // Level 19
        190000  // Level 20
      ];
      
      // Set XP to the MINIMUM for current level (e.g., level 5 char has 10000 XP)
      const xp = level >= 1 ? xpThresholds[level - 1] : 0;
      
      // Get class compendium
      const pack = game.packs?.get('D35E.classes');
      if (!pack) {
        throw new Error("Class compendium 'D35E.classes' not found");
      }

      // Try hardcoded ID first (fast path)
      const classId = getClassId(className);
      let classDoc: any = null;
      
      if (classId) {
        // Direct lookup by ID - fast!
        classDoc = await pack.getDocument(classId);
        if (classDoc) {
          console.log(`D35EAdapter | Found class ${className} by ID`);
        }
      }
      
      // Fallback: Find class by name (slow path for unknown classes)
      if (!classDoc) {
        console.warn(`D35EAdapter | Class '${className}' not in hardcoded IDs, falling back to name lookup`);
        const index = await pack.getIndex();
        const classEntry = index.find((i: any) => i.name === className);
        
        if (!classEntry) {
          throw new Error(`Class '${className}' not found in compendium`);
        }

        classDoc = await pack.getDocument(classEntry._id);
      }
      
      if (!classDoc) {
        throw new Error(`Failed to load class document for '${className}'`);
      }

      // Add class to actor FIRST
      const classData = classDoc.toObject();
      const createdItems = await actor.createEmbeddedDocuments('Item', [(classData as any)]);
      const classItem = createdItems[0];

      console.log(`D35EAdapter | Added class ${className}, now setting its level to ${level}`);
      
      // Don't set class level yet - we'll do everything in one update after rollHP
      
      console.log(`D35EAdapter | Class added, now calling rollHP`);
    } catch (error) {
      console.error(`D35EAdapter | Failed to add class ${className}:`, error);
      throw error;
    }
  }

  /**
   * Roll HP for an actor
   */
  static async rollHP(
    actor: Actor, 
    level: number, 
    primaryAbility: "str" | "dex" | "con" | "int" | "wis" | "cha" = "str",
    useMaxHp: boolean = false
  ): Promise<void> {
    try {
      // Get all class items from actor
      const classes = actor.items.filter((i: any) => i.type === "class");
      
      if (classes.length === 0) {
        console.warn(`D35EAdapter | ${actor.name} has no classes, cannot roll HP`);
        return;
      }

      const classItem = classes[0];
      const hd = (classItem as any).system.hd;  // Hit die size (6, 8, 10, 12)
      const classId = classItem.id;
      const className = classItem.name;
      const classImg = classItem.img;

      const rolls: number[] = [];
      const levelUpData: any[] = [];
      const abilityIncreases: Record<string, number> = {};  // Track ability increases
      
      // Get class skills for marking them in levelUpData
      const classSkills = (classItem as any).system.classSkills || {};
      
      // Roll HP for each level and build levelUpData
      for (let lvl = 1; lvl <= level; lvl++) {
        let hpRoll: number;
        
        if (useMaxHp || lvl === 1) {
          // Max HP per level OR first level: max HD
          hpRoll = hd;
        } else {
          // Other levels: roll HD (minimum 1)
          hpRoll = Math.floor(Math.random() * hd) + 1;
        }
        
        rolls.push(hpRoll);
        
        // Build skills object with ALL skills, marking class skills
        const skillsData: any = {};
        
        // Get all skills from the actor's skill list
        const actorSkills = (actor as any).system.skills || {};
        
        for (const skillKey in actorSkills) {
          // Check if this is a class skill
          const isClassSkill = classSkills[skillKey] === true;
          
          skillsData[skillKey] = {
            rank: 0,
            cls: isClassSkill,
            points: 0
          };
        }
        
        // Feats at level 1, and every 3 levels (4, 7, 10, 13, 16, 19)
        const hasFeat = lvl === 1 || (lvl % 3 === 1 && lvl > 1);
        // Ability score increases every 4 levels (4, 8, 12, 16, 20)
        const hasAbility = lvl % 4 === 0;
        
        // Track ability increases
        if (hasAbility) {
          abilityIncreases[primaryAbility] = (abilityIncreases[primaryAbility] || 0) + 1;
        }
        
        levelUpData.push({
          level: lvl,
          id: lvl === 1 ? "_level1" : `_${Math.random().toString(36).substr(2, 9)}`,
          classId: classId,
          class: className,
          classImage: classImg,
          skills: skillsData,
          hp: hpRoll,
          hasFeat: hasFeat,
          hasAbility: hasAbility
        });
      }

      // Store HP rolls on the class item as base HP
      const totalClassHP = rolls.reduce((sum, roll) => sum + roll, 0);
      
      // Get XP thresholds
      const xpThresholds = [
        0, 1000, 3000, 6000, 10000, 15000, 21000, 28000, 36000, 45000,
        55000, 66000, 78000, 91000, 105000, 120000, 136000, 153000, 171000, 190000
      ];
      const xp = level >= 1 ? xpThresholds[level - 1] : 0;
      
      // Prepare ability score update object
      const abilityUpdates: any = {};
      for (const [ability, increase] of Object.entries(abilityIncreases)) {
        const currentValue = (actor as any).system.abilities[ability].value || 10;
        abilityUpdates[`system.abilities.${ability}.value`] = currentValue + increase;
      }
      
      // Get CON modifier for HP calculation
      const conMod = (actor as any).system.abilities.con.mod || 0;
      const totalHP = totalClassHP + (conMod * level);
      
      // Set levelUpProgression FIRST, before updating class levels
      // This ensures ActorUpdater uses level.available instead of summing class levels
      const actorUpdateData: any = {
        "system.details.level.value": level,
        "system.details.level.available": level,
        "system.details.xp.value": xp,
        "system.details.levelUpData": levelUpData,
        "system.details.levelUpProgression": true,
        ...abilityUpdates  // Apply ability score increases
      };
      
      await actor.update(actorUpdateData);
      
      console.log(`D35EAdapter | Applied ability increases for ${actor.name}:`, abilityIncreases);
      
      // Now update class item - ActorUpdater will use level.available instead of class levels
      await classItem.update({
        "system.hp": totalClassHP,
        "system.levels": level
      }, { stopUpdates: true });
      
      // Trigger D35E's internal HP calculation by updating the actor again
      // This forces ActorUpdater to recalculate HP from class.hp + CON modifier
      await actor.update({});
      
      console.log(`D35EAdapter | ${className} levels 1-${level} (d${hd}): Rolled ${rolls.join(', ')} = ${totalClassHP} base HP, XP ${xp}`);
      
    } catch (error) {
      console.error(`D35EAdapter | Failed to roll HP:`, error);
      throw error;
    }
  }

  /**
   * Apply skill ranks to an actor from template
   * Skills must be added AFTER the class is added so we have proper class skill information
   */
  static async addSkills(
    actor: Actor,
    level: number,
    skillList: Array<{ name: string; ranks: number; priority?: "high" | "medium" | "low" }>
  ): Promise<void> {
    try {
      if (!skillList || skillList.length === 0) {
        return;
      }

      // Get the actor's levelUpData to modify skills
      const levelUpData = (actor as any).system.details.levelUpData || [];
      
      if (levelUpData.length === 0) {
        console.warn(`D35EAdapter | No levelUpData found for ${actor.name}, cannot add skills`);
        return;
      }

      // Calculate skill points available per level
      // Get class from first item that's a class
      const classItem = actor.items.find((i: any) => i.type === "class");
      if (!classItem) {
        console.warn(`D35EAdapter | No class found for skill point calculation`);
        return;
      }
      
      const baseSkillPoints = (classItem as any).system.skillsPerLevel || 2;
      const intMod = (actor as any).system.abilities.int?.mod || 0;
      const skillPointsPerLevel = baseSkillPoints + intMod;
      const skillPointsAtLevel1 = skillPointsPerLevel * 4;
      
      console.log(`D35EAdapter | Skill points: Level 1 = ${skillPointsAtLevel1}, Levels 2+ = ${skillPointsPerLevel} each`);

      // PRIORITY-BASED SKILL DISTRIBUTION
      // Priority determines how often a skill gets points:
      // - High: Every level (4 ranks at L1, then 1 per level)
      // - Medium: Every 2 levels (2 ranks at L1, then 1 every 2 levels starting L3)
      // - Low: Every 4 levels (1 rank at L1, then 1 every 4 levels starting L5)
      //
      // Substitution rule: 1 High = 2 Medium = 4 Low = 1 Medium + 2 Low
      
      const distributionPlan: Map<number, Map<string, number>> = new Map();
      
      // Initialize distribution plan for all levels
      for (let lvl = 1; lvl <= level; lvl++) {
        distributionPlan.set(lvl, new Map());
      }
      
      // Group skills by priority
      const highPrioritySkills = skillList.filter(s => s.priority === 'high');
      const mediumPrioritySkills = skillList.filter(s => s.priority === 'medium');
      const lowPrioritySkills = skillList.filter(s => s.priority === 'low');
      
      console.log(`D35EAdapter | ===== SKILL DISTRIBUTION DEBUG =====`);
      console.log(`D35EAdapter | Priority groups: ${highPrioritySkills.length} high, ${mediumPrioritySkills.length} medium, ${lowPrioritySkills.length} low`);
      console.log(`D35EAdapter | High priority:`, highPrioritySkills.map(s => s.name).join(', '));
      console.log(`D35EAdapter | Medium priority:`, mediumPrioritySkills.map(s => s.name).join(', '));
      console.log(`D35EAdapter | Low priority:`, lowPrioritySkills.map(s => s.name).join(', '));
      
      // Distribute points based on priority level
      for (let lvl = 1; lvl <= level; lvl++) {
        const levelPlan = distributionPlan.get(lvl)!;
        
        // High priority: every level
        // Level 1: 4 ranks, Level 2+: 1 rank
        for (const skill of highPrioritySkills) {
          const points = lvl === 1 ? 4 : 1;
          levelPlan.set(skill.name, points);
        }
        
        // Medium priority: every 2 levels (1, 3, 5, 7, 9, ...)
        // Level 1: 2 ranks, Level 3+: 1 rank
        if (lvl === 1 || (lvl >= 3 && lvl % 2 === 1)) {
          for (const skill of mediumPrioritySkills) {
            const points = lvl === 1 ? 2 : 1;
            levelPlan.set(skill.name, points);
          }
        }
        
        // Low priority: every 4 levels (1, 5, 9, 13, ...)
        // Level 1: 1 rank, Level 5+: 1 rank
        if (lvl === 1 || (lvl >= 5 && (lvl - 1) % 4 === 0)) {
          for (const skill of lowPrioritySkills) {
            const points = 1;
            levelPlan.set(skill.name, points);
          }
        }
        
        // Calculate total points spent at this level
        const totalSpent = Array.from(levelPlan.values()).reduce((sum, p) => sum + p, 0);
        const pointsThisLevel = lvl === 1 ? skillPointsAtLevel1 : skillPointsPerLevel;
        
        if (lvl === 1 || lvl === 2 || lvl === level) {
          console.log(`D35EAdapter | Level ${lvl} allocation:`, Array.from(levelPlan.entries()).map(([s, p]) => `${s}:${p}`).join(', '));
          console.log(`D35EAdapter | Level ${lvl}: Allocated ${totalSpent}/${pointsThisLevel} skill points`);
        }
        
        // Warn if we're over budget
        if (totalSpent > pointsThisLevel) {
          console.warn(`D35EAdapter | Level ${lvl}: Over budget! Spent ${totalSpent}/${pointsThisLevel} points`);
        }
      }
      
      // Verify we're not exceeding skill points per level (should always be exact now)
      for (let lvl = 1; lvl <= level; lvl++) {
        const ranksThisLevel = distributionPlan.get(lvl)!;
        const totalPointsSpent = Array.from(ranksThisLevel.values()).reduce((sum, ranks) => sum + ranks, 0);
        const availablePoints = lvl === 1 ? skillPointsAtLevel1 : skillPointsPerLevel;
        
        if (totalPointsSpent !== availablePoints) {
          console.warn(`D35EAdapter | Level ${lvl}: Spent ${totalPointsSpent} but had ${availablePoints} available`);
        }
      }

      // Now apply the distribution plan to the actor
      // Calculate total ranks for each skill across all levels
      const totalRanksBySkill: Map<string, number> = new Map();
      
      for (const [lvl, skillsAtLevel] of distributionPlan.entries()) {
        for (const [skillName, ranksThisLevel] of skillsAtLevel.entries()) {
          const currentTotal = totalRanksBySkill.get(skillName) || 0;
          totalRanksBySkill.set(skillName, currentTotal + ranksThisLevel);
        }
      }
      
      console.log(`D35EAdapter | ===== FINAL SKILL TOTALS =====`);
      for (const [skillName, totalRanks] of totalRanksBySkill.entries()) {
        console.log(`D35EAdapter | ${skillName}: ${totalRanks} ranks`);
      }
      console.log(`D35EAdapter | =================================`);
      
      // Process each skill from the template
      for (const skillEntry of skillList) {
        const skillName = skillEntry.name;
        const totalRanks = totalRanksBySkill.get(skillName) || 0;
        
        console.log(`D35EAdapter | Processing skill: ${skillName} with ${totalRanks} total ranks`);
        
        // Handle subskills (Craft, Profession, Perform)
        let skillKey: string;
        let subSkillName: string | null = null;
        let isSubSkill = false;
        
        if (skillName.includes(':')) {
          // Format is "crf1:Weaponsmithing" or "pro1:Sailor" or "prf1:Sing"
          const [subSkillId, customName] = skillName.split(':');
          skillKey = subSkillId.substring(0, 3); // "crf", "pro", "prf"
          subSkillName = customName;
          isSubSkill = true;
          
          console.log(`D35EAdapter | Identified as subskill: base=${skillKey}, id=${subSkillId}, name=${customName}`);
          
          // First ensure the base skill exists
          if (!(actor as any).system.skills[skillKey]) {
            console.warn(`D35EAdapter | Skill ${skillKey} not found on actor`);
            continue;
          }
          
          // Create the subskill if it doesn't exist
          if (!(actor as any).system.skills[skillKey].subSkills) {
            (actor as any).system.skills[skillKey].subSkills = {};
          }
          
          // Get the subskill ID (crf1, pro1, prf1)
          const fullSubSkillId = subSkillId;
          
          // Get ability modifier for calculating the skill modifier
          const abilityKey = (actor as any).system.skills[skillKey].ability;
          const abilityMod = abilityKey ? (actor as any).system.abilities[abilityKey]?.mod || 0 : 0;
          
          // Create/update the subskill entry
          (actor as any).system.skills[skillKey].subSkills[fullSubSkillId] = {
            name: subSkillName,
            ability: (actor as any).system.skills[skillKey].ability,
            rank: totalRanks,
            notes: "",
            mod: totalRanks + abilityMod,  // Total modifier = ranks + ability modifier
            rt: (actor as any).system.skills[skillKey].rt || false,
            cs: true, // Class skill
            acp: (actor as any).system.skills[skillKey].acp || false,
            acpPenalty: 0,
            energyDrainPenalty: 0,
            abilityModifier: abilityMod,
            value: null,
            points: totalRanks  // For class skills, points = ranks (1:1 ratio)
          };
          
          console.log(`D35EAdapter | Added subskill ${skillKey}.${fullSubSkillId}: ${subSkillName} with ${totalRanks} ranks`);
        } else {
          // Regular skill
          skillKey = skillName;
          
          if (!(actor as any).system.skills[skillKey]) {
            console.warn(`D35EAdapter | Skill ${skillKey} not found on actor`);
            continue;
          }
        }
        
        // Apply the distribution plan from our calculation above
        let cumulativeRanks = 0; // Track cumulative ranks for subskills
        
        // For subskills, we need to ensure ALL levels have the subskills structure
        // even if they don't receive any ranks
        for (let lvl = 1; lvl <= level; lvl++) {
          const levelData = levelUpData.find((l: any) => l.level === lvl);
          if (levelData && levelData.skills && levelData.skills[skillKey]) {
            // Get ranks assigned to this skill at this level from our distribution plan
            const ranksThisLevel = distributionPlan.get(lvl)?.get(skillName) || 0;
            
            if (isSubSkill && subSkillName) {
              // For subskills, we need to create a nested subskills object in levelUpData
              const subSkillId = skillName.split(':')[0]; // Get "prf1", "crf1", etc.
              
              console.log(`D35EAdapter | Adding subskill to levelUpData level ${lvl}: ${skillKey}.subskills.${subSkillId}, rank=${cumulativeRanks}, points=${ranksThisLevel}`);
              
              // Initialize the subskills object if it doesn't exist
              if (!levelData.skills[skillKey].subskills) {
                levelData.skills[skillKey].subskills = {};
                console.log(`D35EAdapter | Created subskills object for ${skillKey} at level ${lvl}`);
              }
              
              // Initialize this subskill entry if it doesn't exist
              if (!levelData.skills[skillKey].subskills[subSkillId]) {
                levelData.skills[skillKey].subskills[subSkillId] = {
                  rank: 0,
                  cls: true,
                  points: 0
                };
                console.log(`D35EAdapter | Created subskill entry ${subSkillId}`);
              }
              
              // Add ranks to this subskill
              // The rank field in levelUpData represents cumulative rank from PREVIOUS levels
              // So it should be the cumulative before adding this level's points
              levelData.skills[skillKey].subskills[subSkillId].rank = cumulativeRanks;
              if (ranksThisLevel > 0) {
                levelData.skills[skillKey].subskills[subSkillId].points += ranksThisLevel;
              }
              
              cumulativeRanks += ranksThisLevel;
            } else {
              // For regular skills, add to the base skill rank/points
              if (ranksThisLevel > 0) {
                levelData.skills[skillKey].rank += ranksThisLevel;
                levelData.skills[skillKey].points += ranksThisLevel;
              }
            }
          }
        }
        
        // Update the skill's total ranks and points
        if (isSubSkill) {
          // For subskills, don't update the BASE skill rank, only the subskill itself has ranks
          // The base skill rank should remain 0
          // We already updated the subskill above
        } else {
          // For regular skills, update the base skill's total
          (actor as any).system.skills[skillKey].rank = ((actor as any).system.skills[skillKey].rank || 0) + totalRanks;
          (actor as any).system.skills[skillKey].points = ((actor as any).system.skills[skillKey].points || 0) + totalRanks;
          console.log(`D35EAdapter | Added skill ${skillKey} with ${totalRanks} ranks`);
        }
      }
      
      // Save the updated levelUpData and skills
      await actor.update({
        "system.details.levelUpData": levelUpData,
        "system.skills": (actor as any).system.skills
      });
      
      console.log(`D35EAdapter | Applied ${skillList.length} skills to ${actor.name}`);
      
    } catch (error) {
      console.error(`D35EAdapter | Failed to add skills:`, error);
      throw error;
    }
  }

  /**
   * Add equipment to an actor based on template starting kit and level
   * NOW WITH MAGIC ITEM SUPPORT!
   * @param identifyItems - If true, magic items will be identified; if false, they'll be unidentified (for loot)
   * @param extraMoneyInBank - If true, excess gold becomes a bank deposit slip with only pocket change remaining
   */
  static async addEquipment(
    actor: Actor,
    template: any,  // TownieTemplate
    level: number,
    identifyItems: boolean = false,
    extraMoneyInBank: boolean = false,
    bankName: string = "The First Bank of Lower Everbrook"
  ): Promise<void> {
    try {
      console.log(`\n=== EQUIPMENT SYSTEM ===`);
      console.log(`Template: ${template.name}, Level: ${level}`);
      console.log(`Use Standard Budget: ${template.useStandardBudget !== false}`);
      console.log(`Identify Items: ${identifyItems}`);
      console.log(`Extra Money in Bank: ${extraMoneyInBank}`);
      console.log(`Bank Name: ${bankName}`);

      // Import wealth data and equipment resolver
      const { getWealthForLevel, convertToCoins, CLASS_STARTING_WEALTH } = await import('./data/wealth');
      const { calculateKitCost } = await import('./data/equipment-resolver');

      // Check if using standard adventurer budget
      const useStandardBudget = template.useStandardBudget !== false;
      
      // Step 1: Calculate total wealth (or token amount if no standard budget)
      const className = template.classes?.[0]?.name || "Fighter";
      const totalWealth = useStandardBudget 
        ? getWealthForLevel(level, className)
        : 0; // No wealth budget when standard budget is disabled
      console.log(`Total Wealth: ${totalWealth} gp${!useStandardBudget ? ' (standard budget disabled)' : ''}`);
      
      // Helper function to calculate token gold (50-100% of level 1 wealth for the class)
      const calculateTokenGold = (): number => {
        const level1Wealth = CLASS_STARTING_WEALTH[className] || CLASS_STARTING_WEALTH["Fighter"] || 150;
        const percentage = 0.5 + (Math.random() * 0.5); // 50% to 100%
        return Math.floor(level1Wealth * percentage);
      };

      // Step 2: Check if template has starting kit
      const kit = template.startingKit;
      if (!kit) {
        if (useStandardBudget) {
          console.log("No starting kit defined, adding coins only");
          await this.addCoins(actor, totalWealth);
        } else {
          // Token gold amount for NPCs without standard budget (50-100% of level 1 wealth)
          const tokenGold = calculateTokenGold();
          console.log(`No starting kit defined, adding token gold: ${tokenGold} gp (50-100% of level 1 ${className} wealth)`);
          await this.addCoins(actor, tokenGold);
        }
        console.log("=== EQUIPMENT COMPLETE ===\n");
        return;
      }

      // Step 3: Calculate mundane equipment cost (with equipment resolver for level scaling and randomization)
      const mundaneCost = calculateKitCost(kit, level);
      console.log(`Mundane Equipment Cost: ${mundaneCost} gp`);

      // If standard budget is disabled, just add mundane items and token gold
      if (!useStandardBudget) {
        console.log("Standard budget disabled - adding mundane items only, no magic items");
        
        // Add mundane items WITHOUT any magic enhancements
        await this.addMundaneItems(actor, kit, null, level, false, className);
        
        // Add token gold amount (50-100% of level 1 wealth for the class)
        const tokenGold = calculateTokenGold();
        console.log(`Adding token gold: ${tokenGold} gp (50-100% of level 1 ${className} wealth)`);
        await this.addCoins(actor, tokenGold);
        
        console.log("=== EQUIPMENT COMPLETE (NO MAGIC) ===\n");
        return;
      }

      // Step 4: Calculate magic item budget (only if using standard budget)
      const magicBudget = totalWealth - mundaneCost;
      console.log(`Magic Item Budget: ${magicBudget} gp`);

      // Step 5: Select magic items based on level, class, and budget
      // Get character's STR to determine if they can carry Bag of Holding
      const strScore = (actor.system as any)?.abilities?.str?.total ?? 
                       (actor.system as any)?.abilities?.str?.value ?? 10;
      console.log(`Character STR: ${strScore} (for Bag of Holding eligibility)`);
      
      const { selectMagicItems, addWondrousItemsToActor } = await import('./data/magic-item-system');
      
      // Check if template has a shield (used to detect melee vs caster build for clerics/druids)
      const hasShield = !!kit.shield;
      console.log(`Template has shield: ${hasShield} (used for cleric/druid build detection)`);
      
      const magicItems = await selectMagicItems(level, className, magicBudget, template.magicItemBudgets, strScore, hasShield);

      // Step 6: Add mundane items (with enhancements if selected)
      await this.addMundaneItems(actor, kit, magicItems, level, identifyItems, className);

      // Step 6b: Add wondrous items (Big Six)
      // Filter out Scarab of Protection if using custom version (D35E compendium bug)
      const wondrousItemsToAdd = magicItems.hasScarabOfProtection
        ? magicItems.wondrousItems.filter(item => !item.name.includes('Scarab of Protection'))
        : magicItems.wondrousItems;
      
      await addWondrousItemsToActor(actor, wondrousItemsToAdd, identifyItems);
      
      // Step 6b.5: Add custom Handy Haversack if selected
      if (magicItems.hasHandyHaversack) {
        const { CUSTOM_HANDY_HAVERSACK } = await import('./data/wondrous-items');
        console.log('\n=== ADDING CUSTOM HANDY HAVERSACK ===');
        console.log('Creating custom loot container (not from compendium)...');
        
        // Create the custom haversack directly
        const haversackData = {
          ...CUSTOM_HANDY_HAVERSACK,
          system: {
            ...CUSTOM_HANDY_HAVERSACK.system,
            identified: identifyItems,
            identifiedName: CUSTOM_HANDY_HAVERSACK.name,
            unidentified: {
              name: 'Backpack',
              price: 0
            },
            carried: true,
            equipped: true
          }
        };
        
        await actor.createEmbeddedDocuments("Item", [haversackData]);
        console.log('✓ Added Handy Haversack (Custom Container) - 2,000 gp');
        console.log('  - 120 lbs capacity, 5 lbs constant weight');
        console.log('  - Items always on top, move action retrieval');
        console.log('=== CUSTOM HANDY HAVERSACK ADDED ===\n');
      }
      
      // Step 6b.6: Add custom Scarab of Protection if selected (D35E compendium missing SR 20)
      if (magicItems.hasScarabOfProtection) {
        const { CUSTOM_SCARAB_OF_PROTECTION } = await import('./data/wondrous-items');
        console.log('\n=== ADDING CUSTOM SCARAB OF PROTECTION ===');
        console.log('Creating custom wondrous item (D35E compendium bug fix)...');
        
        // Create the custom scarab with SR 20 changes array
        const scarabData = {
          ...CUSTOM_SCARAB_OF_PROTECTION,
          system: {
            ...CUSTOM_SCARAB_OF_PROTECTION.system,
            identified: identifyItems,
            carried: true,
            equipped: true
          }
        };
        
        await actor.createEmbeddedDocuments("Item", [scarabData]);
        console.log('✓ Added Scarab of Protection (Custom Fixed Version) - 38,000 gp');
        console.log('  - SR 20 applied correctly via changes array');
        console.log('  - 12 charges to absorb death/energy drain effects');
        console.log('=== CUSTOM SCARAB OF PROTECTION ADDED ===\n');
      }
      
      // Step 6c: Add wands for casters
      if (magicItems.wands && magicItems.wands.length > 0) {
        const { addWandsToActor } = await import('./data/wand-creation');
        await addWandsToActor(actor, magicItems.wands, identifyItems);
      }
      
      // Step 6d: Add scrolls for casters
      if (magicItems.scrolls && magicItems.scrolls.length > 0) {
        const { createScrollsForActor } = await import('./data/scroll-creation');
        await createScrollsForActor(actor, magicItems.scrolls, identifyItems);
      }
      
      // Step 6e: Add potions for all characters
      if (magicItems.potions && magicItems.potions.length > 0) {
        const { createPotionsForActor } = await import('./data/potion-creation');
        await createPotionsForActor(actor, magicItems.potions, identifyItems);
      }
      
      // Step 6f: Add rods and staves for casters
      if ((magicItems.rods && magicItems.rods.length > 0) || magicItems.staff) {
        const { addRodsAndStaffToActor } = await import('./data/rod-staff-creation');
        await addRodsAndStaffToActor(actor, magicItems.rods || [], magicItems.staff || null, identifyItems);
      }

      // Step 7: Calculate remaining wealth
      // Subtract overspend for special purchases like Staff of Power
      const overspend = magicItems.overspend ?? 0;
      const remainder = totalWealth - mundaneCost - magicItems.totalCost - overspend;
      console.log(`Remaining Wealth: ${remainder} gp`);
      if (overspend > 0) {
        console.log(`  (includes ${overspend} gp overspend for Staff of Power)`);
      }

      // Step 8: Add remaining wealth as coins (or as bank deposit with pocket change)
      if (extraMoneyInBank && remainder > 0) {
        // Calculate pocket change (50-100% of level 1 wealth for the class)
        const pocketChange = calculateTokenGold();
        
        // Only create bank deposit if there's meaningful money beyond pocket change
        // Threshold: remainder must be at least pocket change + 50gp to justify a deposit
        const minDepositThreshold = pocketChange + 50;
        
        if (remainder > minDepositThreshold) {
          // Deposit the excess, keep pocket change
          const depositAmount = Math.floor(remainder - pocketChange);
          
          console.log(`\n=== BANK DEPOSIT ===`);
          console.log(`Total remainder: ${remainder} gp`);
          console.log(`Pocket change: ${pocketChange} gp`);
          console.log(`Bank deposit: ${depositAmount} gp`);
          console.log(`Bank name: ${bankName}`);
          
          // Create the bank deposit slip item
          await this.createBankDepositSlip(actor, depositAmount, bankName);
          
          // Give pocket change as randomized coins
          await this.addCoins(actor, pocketChange);
          console.log(`=== BANK DEPOSIT COMPLETE ===\n`);
        } else {
          // Not enough to justify a bank deposit, just give all as pocket change
          console.log(`Remainder (${remainder} gp) below deposit threshold (${minDepositThreshold} gp), keeping as coins`);
          await this.addCoins(actor, remainder);
        }
      } else {
        await this.addCoins(actor, remainder);
      }

      console.log("=== EQUIPMENT COMPLETE ===\n");
    } catch (error) {
      console.error(`D35EAdapter | Failed to add equipment:`, error);
      throw error;
    }
  }

  /**
   * Calculate total cost of a starting kit
   */
  private static calculateKitCost(kit: any): number {
    let total = 0;

    // Weapons
    if (kit.weapons) {
      kit.weapons.forEach((w: any) => {
        total += w.cost * (w.quantity || 1);
      });
    }

    // Armor
    if (kit.armor) {
      total += kit.armor.cost;
    }

    // Shield
    if (kit.shield) {
      total += kit.shield.cost;
    }

    // Ammunition
    if (kit.ammo) {
      kit.ammo.forEach((a: any) => {
        total += a.cost * (a.quantity || 1);
      });
    }

    // Gear
    if (kit.gear) {
      kit.gear.forEach((g: any) => {
        total += g.cost * (g.quantity || 1);
      });
    }

    // Tools
    if (kit.tools) {
      kit.tools.forEach((t: any) => {
        total += t.cost * (t.quantity || 1);
      });
    }

    return Math.round(total * 10) / 10; // Round to 1 decimal place
  }

  /**
   * Add mundane items from starting kit to actor
   * Now supports magic item enhancements!
   * @param identifyItems - If true, enhanced items will be identified; if false, unidentified
   * @param characterClass - The character's class for special handling (e.g., casters put ranged weapons in containers)
   */
  private static async addMundaneItems(actor: any, kit: any, magicItems?: any, level: number = 1, identifyItems: boolean = false, characterClass: string = "Fighter"): Promise<void> {
    const itemsToAdd: any[] = [];
    let backpackId: string | null = null;
    
    // Track ranged weapon IDs for pure casters to put them in containers
    const rangedWeaponNames: string[] = [];

    console.log("D35EAdapter | Resolving equipment options for level", level);
    
    // Import equipment resolver
    const { resolveEquipmentArray, resolveEquipmentOption } = await import('./data/equipment-resolver');
    
    // Resolve all equipment options based on character level
    const resolvedWeapons = kit.weapons ? resolveEquipmentArray(kit.weapons, level) : [];
    const resolvedArmor = kit.armor ? resolveEquipmentOption(kit.armor, level) : null;
    const resolvedShield = kit.shield ? resolveEquipmentOption(kit.shield, level) : null;
    const resolvedGear = kit.gear ? resolveEquipmentArray(kit.gear, level) : [];
    const resolvedTools = kit.tools ? resolveEquipmentArray(kit.tools, level) : [];
    const resolvedAmmo = kit.ammo ? resolveEquipmentArray(kit.ammo, level) : [];

    console.log("D35EAdapter | Searching for items in compendiums...");

    // Add weapons - first one equipped, others carried
    // Apply magic enhancement to first and second weapons if selected
    if (resolvedWeapons.length > 0) {
      for (let i = 0; i < resolvedWeapons.length; i++) {
        const weapon = resolvedWeapons[i];
        console.log(`D35EAdapter | Searching for weapon: "${weapon.name}"`);
        const itemData = await this.findItemInCompendium("weapon", weapon.name);
        if (itemData) {
          console.log(`D35EAdapter | ✓ Found weapon: ${weapon.name}`);
          
          let weaponToAdd = {
            ...itemData,
            system: {
              ...itemData.system,
              quantity: weapon.quantity || 1,
              equipped: i === 0 // Only equip first weapon
            }
          };

          // Apply magic enhancement to primary weapon (index 0)
          if (i === 0 && magicItems?.weaponEnhancement) {
            console.log(`D35EAdapter | Applying primary weapon enhancement...`);
            const { applyWeaponEnhancements } = await import('./data/magic-item-system');
            weaponToAdd = await applyWeaponEnhancements(
              weaponToAdd,
              magicItems.weaponEnhancement.bonus,
              magicItems.weaponEnhancement.abilities
            );
            // Keep it equipped
            weaponToAdd.system.equipped = true;
          }
          
          // Apply magic enhancement to secondary weapon (index 1)
          if (i === 1 && magicItems?.secondaryWeaponEnhancement) {
            console.log(`D35EAdapter | Applying secondary weapon enhancement...`);
            const { applyWeaponEnhancements } = await import('./data/magic-item-system');
            weaponToAdd = await applyWeaponEnhancements(
              weaponToAdd,
              magicItems.secondaryWeaponEnhancement.bonus,
              magicItems.secondaryWeaponEnhancement.abilities
            );
            // Secondary weapon not equipped by default
          }
          
          // Track ranged weapons for pure casters to put in containers
          const weaponNameLower = weapon.name.toLowerCase();
          const isRangedWeapon = weaponNameLower.includes('crossbow') || 
                                  weaponNameLower.includes('bow') ||
                                  weaponNameLower.includes('sling');
          if (isRangedWeapon) {
            rangedWeaponNames.push(weapon.name);
            console.log(`D35EAdapter | → Tracked as ranged weapon for potential container storage`);
          }
          
          itemsToAdd.push(weaponToAdd);
          
          if (i === 0) {
            console.log(`D35EAdapter | → Equipped as primary weapon`);
          } else if (i === 1) {
            console.log(`D35EAdapter | → Carried as secondary weapon (enhanced)`);
          } else {
            console.log(`D35EAdapter | → Carried (not equipped)`);
          }
        } else {
          console.warn(`D35EAdapter | ✗ Weapon not found: ${weapon.name}`);
        }
      }
    }

    // Add armor - always equipped
    // Apply magic enhancement if selected
    if (resolvedArmor) {
      console.log(`D35EAdapter | Searching for armor: "${resolvedArmor.name}"`);
      const itemData = await this.findItemInCompendium("equipment", resolvedArmor.name);
      if (itemData) {
        console.log(`D35EAdapter | ✓ Found armor: ${resolvedArmor.name}`);
        
        let armorToAdd = {
          ...itemData,
          system: {
            ...itemData.system,
            equipped: true
          }
        };

        // Apply magic enhancement to armor
        if (magicItems?.armorEnhancement) {
          console.log(`D35EAdapter | Applying magic enhancement to armor...`);
          const { applyArmorEnhancements } = await import('./data/magic-item-system');
          armorToAdd = await applyArmorEnhancements(
            armorToAdd,
            magicItems.armorEnhancement.bonus,
            magicItems.armorEnhancement.abilities
          );
          // Keep it equipped
          armorToAdd.system.equipped = true;
        }

        itemsToAdd.push(armorToAdd);
        console.log(`D35EAdapter | → Equipped`);
      } else {
        console.warn(`D35EAdapter | ✗ Armor not found: ${resolvedArmor.name}`);
      }
    }

    // Add shield - always equipped (template designer decides if shield should be included)
    // Apply magic enhancement if selected
    if (resolvedShield) {
      console.log(`D35EAdapter | Searching for shield: "${resolvedShield.name}"`);
      const itemData = await this.findItemInCompendium("equipment", resolvedShield.name);
      if (itemData) {
        console.log(`D35EAdapter | ✓ Found shield: ${resolvedShield.name}`);
        
        let shieldToAdd = {
          ...itemData,
          system: {
            ...itemData.system,
            equipped: true
          }
        };

        // Apply magic enhancement to shield (shields use armor enhancement mechanics)
        if (magicItems?.shieldEnhancement) {
          console.log(`D35EAdapter | Applying magic enhancement to shield...`);
          const { applyArmorEnhancements } = await import('./data/magic-item-system');
          shieldToAdd = await applyArmorEnhancements(
            shieldToAdd,
            magicItems.shieldEnhancement.bonus,
            magicItems.shieldEnhancement.abilities
          );
          // Keep it equipped
          shieldToAdd.system.equipped = true;
        }

        itemsToAdd.push(shieldToAdd);
        console.log(`D35EAdapter | → Equipped`)
      } else {
        console.warn(`D35EAdapter | ✗ Shield not found: ${resolvedShield.name}`);
      }
    }

    // PHASE 1: Create backpack first (so we have its ID for other items)
    console.log(`D35EAdapter | === PHASE 1: Creating backpack ===`);
    if (resolvedGear.length > 0) {
      const backpackItem = resolvedGear.find((item: any) => 
        item.name.toLowerCase().includes("backpack")
      );
      
      if (backpackItem) {
        console.log(`D35EAdapter | Searching for backpack: "${backpackItem.name}"`);
        const itemData = await this.findItemInCompendium("loot", backpackItem.name);
        if (itemData) {
          console.log(`D35EAdapter | ✓ Found backpack: ${backpackItem.name}`);
          try {
            const created = await actor.createEmbeddedDocuments("Item", [{
              ...itemData,
              system: {
                ...itemData.system,
                quantity: backpackItem.quantity || 1,
                equipped: false
              }
            }]);
            backpackId = created[0].id;
            console.log(`D35EAdapter | ✓ Created backpack with ID: ${backpackId}`);
          } catch (error) {
            console.error(`D35EAdapter | ✗ Failed to create backpack:`, error);
          }
        } else {
          console.warn(`D35EAdapter | ✗ Backpack not found: ${backpackItem.name}`);
        }
      }
    }

    // PHASE 2: Create remaining items (gear goes in backpack if we have one)
    console.log(`D35EAdapter | === PHASE 2: Creating remaining items ===`);

    // Add ammunition (will move to backpack after creation)
    if (resolvedAmmo.length > 0) {
      for (const ammo of resolvedAmmo) {
        console.log(`D35EAdapter | Searching for ammo: "${ammo.name}"`);
        const itemData = await this.findItemInCompendium("loot", ammo.name);
        if (itemData) {
          console.log(`D35EAdapter | ✓ Found ammo: ${ammo.name}`);
          itemsToAdd.push({
            ...itemData,
            system: {
              ...itemData.system,
              quantity: ammo.quantity || 1,
              equipped: false
            }
          });
        } else {
          console.warn(`D35EAdapter | ✗ Ammo not found: ${ammo.name}`);
        }
      }
    }

    // Add gear (excluding backpack, will move to backpack after creation)
    if (resolvedGear.length > 0) {
      for (const item of resolvedGear) {
        // Skip backpack - already created
        if (item.name.toLowerCase().includes("backpack")) continue;
        
        console.log(`D35EAdapter | Searching for gear: "${item.name}"`);
        const itemData = await this.findItemInCompendium("loot", item.name);
        if (itemData) {
          console.log(`D35EAdapter | ✓ Found gear: ${item.name}`);
          itemsToAdd.push({
            ...itemData,
            system: {
              ...itemData.system,
              quantity: item.quantity || 1,
              equipped: false
            }
          });
        } else {
          console.warn(`D35EAdapter | ✗ Gear not found: ${item.name}`);
        }
      }
    }

    // Add tools (will move to backpack after creation)
    if (resolvedTools.length > 0) {
      for (const tool of resolvedTools) {
        console.log(`D35EAdapter | Searching for tool: "${tool.name}"`);
        const itemData = await this.findItemInCompendium("loot", tool.name);
        if (itemData) {
          console.log(`D35EAdapter | ✓ Found tool: ${tool.name}`);
          itemsToAdd.push({
            ...itemData,
            system: {
              ...itemData.system,
              quantity: tool.quantity || 1,
              equipped: false
            }
          });
        } else {
          console.warn(`D35EAdapter | ✗ Tool not found: ${tool.name}`);
        }
      }
    }

    // Create remaining items (weapons, armor, shield, gear, ammo, tools)
    console.log(`D35EAdapter | Attempting to create ${itemsToAdd.length} remaining items...`);
    if (itemsToAdd.length > 0) {
      try {
        const created = await actor.createEmbeddedDocuments("Item", itemsToAdd);
        console.log(`D35EAdapter | ✓ Successfully added ${created.length} items to inventory`);
        
        // PHASE 3: Move gear/ammo/tools into backpack (post-creation update required)
        // Note: We need to do this AFTER character creation is fully complete
        // because D35E's actor.refresh() resets item containers during creation
        if (backpackId) {
          console.log(`D35EAdapter | === PHASE 3: Preparing container move (deferred) ===`);
          
          // Check if this is a pure caster (wizard/sorcerer) - they put ranged weapons in containers
          const { isPureCaster } = await import('./data/rod-staff-recommendations');
          const characterIsPureCaster = isPureCaster(characterClass);
          
          const itemsToMove = created.filter((item: any) => {
            // Always move loot (gear, tools) except the backpack itself
            if (item.type === "loot" && item.id !== backpackId) {
              return true;
            }
            
            // For pure casters, also move ranged weapons into containers
            // They're emergency weapons only, not primary combat options
            if (characterIsPureCaster && item.type === "weapon") {
              const itemName = item.name?.toLowerCase() || '';
              const isRangedWeapon = rangedWeaponNames.some(name => 
                itemName.includes(name.toLowerCase())
              ) || itemName.includes('crossbow') || 
                 itemName.includes('bow') || 
                 itemName.includes('sling');
              
              if (isRangedWeapon) {
                console.log(`D35EAdapter | Pure caster: Moving ${item.name} to container (emergency weapon only)`);
                return true;
              }
            }
            
            return false;
          });
          
          if (itemsToMove.length > 0) {
            console.log(`D35EAdapter | ${itemsToMove.length} items will be moved into backpack after character creation`);
            
            // Store the move data for later execution
            // We'll return this info so the calling code can complete the move
            // after the character is fully saved
            (actor as any)._pendingContainerMoves = {
              backpackId,
              itemIds: itemsToMove.map((item: any) => item.id)
            };
          }
        }
      } catch (error) {
        console.error(`D35EAdapter | ✗ Failed to create items:`, error);
      }
    } else {
      console.warn(`D35EAdapter | No items found in compendiums - check item names`);
    }
  }

  /**
   * Find an item in D35E compendiums
   */
  private static async findItemInCompendium(
    type: string,
    name: string
  ): Promise<any> {
    // Try multiple possible compendium names
    let packsToSearch: string[] = [];
    
    switch (type) {
      case "weapon":
        packsToSearch = ["D35E.weapons-and-ammo", "D35E.items"];
        break;
      case "equipment":
        packsToSearch = ["D35E.armors-and-shields", "D35E.items"];
        break;
      case "loot":
      case "gear":
      case "tool":
        packsToSearch = ["D35E.items", "D35E.armors-and-shields", "D35E.weapons-and-ammo"];
        break;
      case "ammo":
        packsToSearch = ["D35E.weapons-and-ammo", "D35E.items"];
        break;
      default:
        console.warn(`D35EAdapter | Unknown item type: ${type}`);
        return null;
    }

    // Try each compendium pack until we find the item
    for (const packName of packsToSearch) {
      const pack = game.packs?.get(packName);
      if (!pack) {
        continue; // Try next pack
      }

      try {
        const index = await pack.getIndex();
        const entry = index.find((e: any) =>
          e.name.toLowerCase() === name.toLowerCase()
        );

        if (entry) {
          const doc = await pack.getDocument(entry._id);
          const itemData = doc?.toObject();
          if (itemData) {
            console.log(`D35EAdapter | Found "${name}" in ${packName}`);
            return itemData;
          }
        }
      } catch (error) {
        console.error(`D35EAdapter | Error searching ${packName} for ${name}:`, error);
      }
    }

    // Item not found in any compendium
    console.warn(`D35EAdapter | Item "${name}" not found in any compendium (searched: ${packsToSearch.join(", ")})`);
    return null;
  }

  /**
   * Add coins to actor with randomized distribution across coin types
   */
  private static async addCoins(actor: Actor, amount: number): Promise<void> {
    if (amount <= 0) {
      console.log(`D35EAdapter | No coins to add (amount: ${amount})`);
      return;
    }

    // Import conversion function - use randomized version for natural feel
    const { convertToRandomizedCoins } = await import('./data/wealth');
    const coins = convertToRandomizedCoins(amount);

    // Set currency on actor
    await actor.update({
      "system.currency.pp": coins.pp,
      "system.currency.gp": coins.gp,
      "system.currency.sp": coins.sp,
      "system.currency.cp": coins.cp
    });

    // Calculate total GP value for verification
    const totalGpValue = (coins.pp * 10) + coins.gp + (coins.sp / 10) + (coins.cp / 100);
    console.log(`D35EAdapter | Added coins: ${coins.pp}pp ${coins.gp}gp ${coins.sp}sp ${coins.cp}cp (≈${totalGpValue.toFixed(2)} gp from ${amount} gp)`);
  }

  /**
   * Create a bank deposit slip item for excess gold
   * @param actor - The actor to add the deposit slip to
   * @param amount - Amount in gold pieces to deposit
   * @param bankName - Name of the bank for the deposit slip
   */
  private static async createBankDepositSlip(actor: Actor, amount: number, bankName: string = "The First Bank of Lower Everbrook"): Promise<void> {
    // Format the amount with commas for readability
    const formattedAmount = amount.toLocaleString();
    
    // Create the bank deposit slip item data
    const depositSlipData = {
      name: `Bank Deposit Slip [${formattedAmount} gp]`,
      type: 'loot',
      img: 'systems/D35E/icons/items/inventory/Quest_21.png',
      system: {
        description: {
          value: `<p>Let it be known that <strong>${actor.name}</strong> has entrusted <strong>${formattedAmount}</strong> pieces of gold to the keeping of <strong>${bankName}</strong>, to be held in good faith until lawfully withdrawn.</p>`,
          chat: '',
          unidentified: ''
        },
        quantity: 1,
        weight: 0,
        price: 0, // The slip itself has no value - only the deposit does
        identified: true,
        identifiedName: `Bank Deposit Slip [${formattedAmount} gp]`,
        unidentified: {
          price: 0,
          name: 'Piece of Paper'
        },
        subType: 'misc',
        carried: true
      }
    };
    
    // Create the item on the actor
    await actor.createEmbeddedDocuments('Item', [depositSlipData]);
    console.log(`D35EAdapter | Created bank deposit slip for ${formattedAmount} gp at ${bankName}`);
  }

  /**
   * Complete pending container moves (must be called after character creation is fully complete)
   * Prefers magical containers (Handy Haversack, Bag of Holding) over regular backpack
   * 
   * Container weights:
   * - Handy Haversack: 5 lbs (always usable)
   * - Bag of Holding Type 1-4: 15-60 lbs (only for high-STR characters)
   */
  static async completePendingContainerMoves(actor: any): Promise<void> {
    const pending = (actor as any)._pendingContainerMoves;
    if (!pending) {
      console.log(`D35EAdapter | No pending container moves for ${actor.name}`);
      return;
    }

    console.log(`D35EAdapter | === Completing pending container moves ===`);
    
    // Find the best container - prefer magical containers over backpack
    // Priority: Handy Haversack > Bag of Holding > Backpack
    let targetContainerId = pending.backpackId;
    let containerName = "backpack";
    
    // Check character's strength score (for Bag of Holding weight)
    const strScore = actor.system?.abilities?.str?.total ?? actor.system?.abilities?.str?.value ?? 10;
    
    console.log(`D35EAdapter | Character STR: ${strScore}`);
    
    // Always check for Handy Haversack first - it's only 5 lbs, anyone can use it!
    const handyHaversack = actor.items.find((item: any) => 
      item.name?.toLowerCase().includes("handy haversack")
    );
    
    if (handyHaversack) {
      targetContainerId = handyHaversack.id;
      containerName = "Handy Haversack";
      console.log(`D35EAdapter | Found Handy Haversack (5 lbs) - using as primary container`);
    } else {
      // Check for Bag of Holding (only if STR is high enough for the weight)
      // Type 1: 15 lbs, Type 2: 25 lbs, Type 3: 35 lbs, Type 4: 60 lbs
      const bagOfHolding = actor.items.find((item: any) => 
        item.name?.toLowerCase().includes("bag of holding")
      );
      
      if (bagOfHolding) {
        // Calculate if character can handle the bag's weight
        // Assume light load for STR 10 is ~33 lbs, for STR 14 is ~58 lbs
        const bagName = bagOfHolding.name?.toLowerCase() || '';
        let bagWeight = 15; // Default Type 1
        if (bagName.includes('type 4') || bagName.includes('type iv')) bagWeight = 60;
        else if (bagName.includes('type 3') || bagName.includes('type iii')) bagWeight = 35;
        else if (bagName.includes('type 2') || bagName.includes('type ii')) bagWeight = 25;
        
        // Require STR high enough that bag weight is less than 50% of light load
        // STR 12 light load ~43 lbs, STR 14 light load ~58 lbs, STR 16 light load ~76 lbs
        const canCarryBag = (strScore >= 14 && bagWeight <= 60) || 
                           (strScore >= 12 && bagWeight <= 35) ||
                           (strScore >= 10 && bagWeight <= 15);
        
        if (canCarryBag) {
          targetContainerId = bagOfHolding.id;
          containerName = `Bag of Holding (${bagWeight} lbs)`;
          console.log(`D35EAdapter | Found ${bagOfHolding.name} - using as primary container (STR ${strScore} can carry ${bagWeight} lbs)`);
        } else {
          console.log(`D35EAdapter | Found ${bagOfHolding.name} (${bagWeight} lbs) but STR ${strScore} too low to carry it efficiently - using backpack`);
        }
      }
    }
    
    console.log(`D35EAdapter | Moving ${pending.itemIds.length} items into ${containerName} (${targetContainerId})`);

    // Build updates array
    const updates = pending.itemIds.map((itemId: string) => {
      const item = actor.items.get(itemId);
      console.log(`D35EAdapter | → Moving "${item?.name}" (${itemId})`);
      return {
        _id: itemId,
        "system.container": targetContainerId,
        "system.containerId": targetContainerId  // CRITICAL: D35E requires BOTH fields
      };
    });

    // Execute the batch update
    await actor.updateEmbeddedDocuments("Item", updates);
    console.log(`D35EAdapter | ✓ Completed moving ${updates.length} items into ${containerName}`);

    // CRITICAL: Wait for Foundry to commit changes to database
    // updateEmbeddedDocuments is async but returns before DB commit completes
    console.log(`D35EAdapter | → Waiting for database commit...`);
    await new Promise(resolve => setTimeout(resolve, 250));
    console.log(`D35EAdapter | ✓ Database commit complete`);

    // Clean up the pending data
    delete (actor as any)._pendingContainerMoves;

    // Verify the move worked
    const itemsInContainer = actor.items.filter((i: any) => 
      i.system?.container === targetContainerId
    );
    console.log(`D35EAdapter | ✓ Final verification: ${itemsInContainer.length} items in ${containerName}`);
  }

  /**
   * Generate attack and full-attack items for all equipped weapons
   * Creates individual attack items and full-attack items with iterative attacks based on BAB
   */
  static async addAttacks(actor: Actor): Promise<void> {
    console.log("D35EAdapter | Generating attacks for equipped weapons");

    // Get character's BAB
    const bab = (actor.system as any)?.attributes?.bab?.total || 0;
    console.log(`D35EAdapter | Character BAB: ${bab}`);

    // Calculate number of iterative attacks based on BAB
    const numAttacks = Math.floor(bab / 5) + 1;
    console.log(`D35EAdapter | Iterative attacks: ${numAttacks}`);

    // Check if character is a monk (has Monk class levels)
    const classes = actor.items.filter((item: any) => item.type === "class");
    const isMonk = classes.some((c: any) => c.name?.toLowerCase().includes('monk'));
    console.log(`D35EAdapter | Is Monk: ${isMonk}`);

    // Find all carried weapons (equipped or not)
    const weapons = actor.items.filter((item: any) => 
      item.type === "weapon" && item.system?.carried === true
    );

    console.log(`D35EAdapter | Found ${weapons.length} carried weapons`);

    // For monks, find their Unarmed Strike (Monk) weapon
    let monkUnarmedStrike: any = null;
    if (isMonk) {
      monkUnarmedStrike = weapons.find((w: any) => 
        w.name?.toLowerCase().includes('unarmed strike') && w.name?.toLowerCase().includes('monk')
      );
      if (monkUnarmedStrike) {
        console.log(`D35EAdapter | Found Monk Unarmed Strike: ${monkUnarmedStrike.name}`);
      }
    }

    if (weapons.length === 0) {
      console.log("D35EAdapter | No carried weapons found, skipping attack generation");
      return;
    }

    const attacksToCreate: any[] = [];
    const meleeWeapons: any[] = [];
    const rangedWeapons: any[] = [];

    // Throwable weapon types (can be used melee or ranged)
    const throwableWeaponTypes = ['spear', 'javelin', 'dagger', 'handaxe', 'throwing axe', 'light hammer', 'trident', 'shortspear'];

    // Process each weapon and categorize
    for (const weapon of weapons) {
      const weaponData = weapon.system as any;
      const weaponName = weapon.name!;
      const weaponId = weapon.id!;
      const weaponImg = weapon.img!;
      
      // Check weapon properties to determine if it has multiple attack modes
      const properties = weaponData.properties || {};
      const baseWeaponType = (weaponData.baseWeaponType || '').toLowerCase();
      const isThrown = properties.thr === true || throwableWeaponTypes.some(t => baseWeaponType.includes(t));
      
      console.log(`D35EAdapter | Processing weapon: ${weaponName} (${weaponId}), baseType: ${baseWeaponType}, isThrown: ${isThrown}`);

      // Check for Speed enhancement
      const enhancements = weaponData.enhancements?.items || [];
      const hasSpeedEnhancement = enhancements.some((enh: any) => 
        enh.name?.toLowerCase().includes('speed') || enh.system?.properties?.spd === true
      );
      
      if (hasSpeedEnhancement) {
        console.log(`D35EAdapter | ${weaponName} has Speed enhancement`);
      }

      // If weapon is throwable (like spear), create both melee and ranged attack items
      if (isThrown) {
        // Create melee attack
        const meleeAttackItem = {
          name: weaponName,
          type: "attack",
          img: weaponImg,
          system: {
            activation: { cost: 1, type: "attack" },
            duration: { value: null, units: "inst" },
            target: { value: "" },
            range: { value: null, units: "" },
            actionType: "mwak",
            attackBonus: "",
            critConfirmBonus: "",
            damage: weaponData.damage || { parts: [], alternativeParts: [] },
            attackParts: [],
            formula: "",
            ability: weaponData.ability || { attack: "str", damage: "str", damageMult: 1 },
            save: weaponData.save || { dc: 0, description: "", ability: "", type: "" },
            description: weaponData.description || { value: "", chat: "", unidentified: "" }
          }
        };
        attacksToCreate.push(meleeAttackItem);
        
        // Throwable weapons always go to melee weapons for full-attack
        // (Returning doesn't help with iterative attacks since it returns at end of turn)
        meleeWeapons.push({ id: weaponId, name: weaponName, img: weaponImg, hasSpeed: hasSpeedEnhancement });
        console.log(`D35EAdapter | Created melee attack for ${weaponName}`);

        // Create thrown attack
        const rangedAttackItem = {
          name: `${weaponName} (Thrown)`,
          type: "attack",
          img: weaponImg,
          system: {
            activation: { cost: 1, type: "attack" },
            duration: { value: null, units: "inst" },
            target: { value: "" },
            range: weaponData.range || { value: null, units: "" },
            actionType: "rwak",
            attackBonus: "",
            critConfirmBonus: "",
            damage: weaponData.damage || { parts: [], alternativeParts: [] },
            attackParts: [],
            formula: "",
            ability: weaponData.ability || { attack: "str", damage: "str", damageMult: 1 },
            save: weaponData.save || { dc: 0, description: "", ability: "", type: "" },
            description: weaponData.description || { value: "", chat: "", unidentified: "" }
          }
        };
        attacksToCreate.push(rangedAttackItem);
        console.log(`D35EAdapter | Created thrown attack for ${weaponName}`);
      } else {
        // Single attack mode weapon
        const actionType = weaponData.actionType || "mwak";
        const isRanged = actionType === "rwak";
        const isMelee = actionType === "mwak";

        const attackItem = {
          name: weaponName,
          type: "attack",
          img: weaponImg,
          system: {
            activation: { cost: 1, type: "attack" },
            duration: { value: null, units: "inst" },
            target: { value: "" },
            range: weaponData.range || { value: null, units: "" },
            actionType: actionType,
            attackBonus: "",
            critConfirmBonus: "",
            damage: weaponData.damage || { parts: [], alternativeParts: [] },
            attackParts: [],
            formula: "",
            ability: weaponData.ability || { attack: isRanged ? "dex" : "str", damage: "str", damageMult: 1 },
            save: weaponData.save || { dc: 0, description: "", ability: "", type: "" },
            description: weaponData.description || { value: "", chat: "", unidentified: "" }
          }
        };

        attacksToCreate.push(attackItem);
        console.log(`D35EAdapter | Created ${isRanged ? 'ranged' : 'melee'} attack for ${weaponName}`);

        // Categorize for full-attack creation (skip thrown weapons for full-attack)
        if (isMelee) {
          meleeWeapons.push({ id: weaponId, name: weaponName, img: weaponImg, hasSpeed: hasSpeedEnhancement });
        } else if (isRanged) {
          // Check if weapon can make multiple attacks
          const weaponNameLower = weaponName.toLowerCase();
          const canFullAttack = !(weaponNameLower.includes("heavy crossbow") && !weaponNameLower.includes("repeating"));
          
          if (canFullAttack) {
            rangedWeapons.push({ id: weaponId, name: weaponName, img: weaponImg, hasSpeed: hasSpeedEnhancement });
          } else {
            console.log(`D35EAdapter | ${weaponName} cannot full attack (heavy crossbow reload)`);
          }
        }
      }
    }

    // Create Full Attack (Melee) if there are melee weapons and BAB allows iterative attacks
    if (meleeWeapons.length > 0 && numAttacks > 1) {
      // For monks, prioritize Unarmed Strike (Monk) as primary melee weapon
      let primaryMelee = meleeWeapons[0]; // Default to first melee weapon
      
      if (isMonk && monkUnarmedStrike) {
        // Find the unarmed strike in our processed melee weapons list
        const unarmedInList = meleeWeapons.find(w => w.id === monkUnarmedStrike.id);
        if (unarmedInList) {
          primaryMelee = unarmedInList;
          console.log(`D35EAdapter | Monk: Using ${primaryMelee.name} as primary melee weapon for full attack`);
        } else {
          // Unarmed strike wasn't in the melee list, add it
          const unarmedData = monkUnarmedStrike.system;
          primaryMelee = {
            id: monkUnarmedStrike.id,
            name: monkUnarmedStrike.name,
            img: monkUnarmedStrike.img,
            hasSpeed: false
          };
          console.log(`D35EAdapter | Monk: Using ${primaryMelee.name} as primary melee weapon for full attack (added from class feature)`);
        }
      }
      
      const attacks: any = {};
      
      // Speed enhancement gives an extra attack at full BAB
      let totalAttacks = numAttacks;
      if (primaryMelee.hasSpeed) {
        totalAttacks = numAttacks + 1;
        console.log(`D35EAdapter | ${primaryMelee.name} has Speed enhancement, adding extra attack at full BAB`);
      }
      
      for (let i = 0; i < Math.min(totalAttacks, 5); i++) {
        attacks[`attack${i + 1}`] = {
          _id: i + 1,
          name: primaryMelee.name,
          img: primaryMelee.img,
          primary: i === 0,
          isWeapon: true,
          attackMode: "primary",
          id: primaryMelee.id,
          count: 1
        };
      }

      // Fill remaining attack slots with empties
      for (let i = totalAttacks; i < 5; i++) {
        attacks[`attack${i + 1}`] = {
          _id: i + 1,
          name: "",
          img: "",
          primary: false,
          isWeapon: false,
          attackMode: "primary",
          id: "",
          count: 0
        };
      }

      const fullAttackMelee = {
        name: "Full Attack (Melee)",
        type: "full-attack",
        img: "systems/D35E/icons/attack/full-attack.png",
        system: {
          attacks: attacks,
          attackType: "full",
          description: {
            value: "<p>This is one of the creature's full attacks.</p>",
            chat: "",
            unidentified: ""
          },
          damage: { parts: [], alternativeParts: [] },
          attackParts: [],
          conditionals: [],
          contextNotes: [],
          specialActions: []
        }
      };

      attacksToCreate.push(fullAttackMelee);
      console.log(`D35EAdapter | Created Full Attack (Melee) with ${totalAttacks} attacks using ${primaryMelee.name}${primaryMelee.hasSpeed ? ' (Speed)' : ''}`);
    }

    // Create Full Attack (Ranged) if there are ranged weapons and BAB allows iterative attacks
    if (rangedWeapons.length > 0 && numAttacks > 1) {
      const primaryRanged = rangedWeapons[0]; // Use first ranged weapon as primary
      const attacks: any = {};
      
      // Speed enhancement gives an extra attack at full BAB
      let totalAttacks = numAttacks;
      if (primaryRanged.hasSpeed) {
        totalAttacks = numAttacks + 1;
        console.log(`D35EAdapter | ${primaryRanged.name} has Speed enhancement, adding extra attack at full BAB`);
      }
      
      for (let i = 0; i < Math.min(totalAttacks, 5); i++) {
        attacks[`attack${i + 1}`] = {
          _id: i + 1,
          name: primaryRanged.name,
          img: primaryRanged.img,
          primary: i === 0,
          isWeapon: true,
          attackMode: "primary",
          id: primaryRanged.id,
          count: 1
        };
      }

      // Fill remaining attack slots with empties
      for (let i = totalAttacks; i < 5; i++) {
        attacks[`attack${i + 1}`] = {
          _id: i + 1,
          name: "",
          img: "",
          primary: false,
          isWeapon: false,
          attackMode: "primary",
          id: "",
          count: 0
        };
      }

      const fullAttackRanged = {
        name: "Full Attack (Ranged)",
        type: "full-attack",
        img: "systems/D35E/icons/attack/full-attack.png",
        system: {
          attacks: attacks,
          attackType: "full",
          description: {
            value: "<p>This is one of the creature's full attacks.</p>",
            chat: "",
            unidentified: ""
          },
          damage: { parts: [], alternativeParts: [] },
          attackParts: [],
          conditionals: [],
          contextNotes: [],
          specialActions: []
        }
      };

      attacksToCreate.push(fullAttackRanged);
      console.log(`D35EAdapter | Created Full Attack (Ranged) with ${totalAttacks} attacks using ${primaryRanged.name}${primaryRanged.hasSpeed ? ' (Speed)' : ''}`);
    }

    // Create all attack items
    if (attacksToCreate.length > 0) {
      console.log(`D35EAdapter | Creating ${attacksToCreate.length} attack items`);
      await actor.createEmbeddedDocuments("Item", attacksToCreate);
      console.log(`D35EAdapter | ✓ Successfully created all attack items`);
    }
  }
}
