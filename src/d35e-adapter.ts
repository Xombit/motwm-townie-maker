// D35E System Adapter - Helper functions for interacting with D35E system
export class D35EAdapter {
  /**
   * Get available races from the system
   */
  static async getRaces(): Promise<Array<{ id: string; name: string }>> {
    const races: Array<{ id: string; name: string }> = [];
    
    // Try to get from compendiums
    const racePacks = game.packs?.filter(p => 
      p.metadata.type === "Item" && 
      p.metadata.label?.toLowerCase().includes("race")
    );
    
    if (racePacks) {
      for (const pack of racePacks) {
        const content = await pack.getDocuments();
        for (const item of content) {
          if ((item as any).type === "race") {
            races.push({ id: item.id!, name: item.name! });
          }
        }
      }
    }
    
    return races;
  }

  /**
   * Get available classes from the system
   */
  static async getClasses(): Promise<Array<{ id: string; name: string }>> {
    const classes: Array<{ id: string; name: string }> = [];
    
    // Followers/companions to exclude
    const excludedFollowers = [
      "familiar", "animal companion", "paladin mount", "psicrystal", 
      "special mount", "companion", "drake companion", "eidolon"
    ];
    
    // Try to get from compendiums
    const classPacks = game.packs?.filter(p => 
      p.metadata.type === "Item" && 
      p.metadata.label?.toLowerCase().includes("class")
    );
    
    if (classPacks) {
      for (const pack of classPacks) {
        const content = await pack.getDocuments();
        for (const item of content) {
          const itemData = item as any;
          if (itemData.type === "class") {
            const itemName = item.name!.toLowerCase();
            
            // Skip followers/companions
            if (excludedFollowers.some(follower => itemName.includes(follower))) {
              continue;
            }
            
            // Skip prestige classes (they have classType === "prestige")
            if (itemData.system?.classType === "prestige") {
              continue;
            }
            
            classes.push({ id: item.id!, name: item.name! });
          }
        }
      }
    }
    
    return classes;
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

    // Create the actor
    const actor = await Actor.create({
      name: data.name,
      type: data.type,
      folder: folderId,
      img: "icons/svg/mystery-man.svg"
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
   * Add a race to an actor
   */
  static async addRace(actor: Actor, raceName: string): Promise<void> {
    try {
      // Get race compendium
      const pack = game.packs?.get('D35E.racialfeatures');
      if (!pack) {
        throw new Error("Race compendium 'D35E.racialfeatures' not found");
      }

      // Find race by name
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
      console.log(`D35EAdapter | Added race ${raceName} to ${actor.name}`);
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
   */
  static async addFeats(actor: Actor, level: number, featList: Array<string | any>, isHuman: boolean = false): Promise<void> {
    try {
      // Calculate feat progression: Level 1, then every 3 levels (3, 6, 9, 12, 15, 18)
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
      
      // Get only the feats they should have at this level
      const featsToAdd = featList.slice(0, featLevels.length);
      
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
        const featEntry = featsToAdd[i];
        const featAddedAtLevel = featLevels[i]; // Level this specific feat was gained
        
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
                    console.log(`D35EAdapter | Configured ${featName} with weapon: ${featConfig.config.weaponGroup}`);
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
   * Add a class to an actor
   */
  static async addClass(actor: Actor, className: string, level: number): Promise<void> {
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

      // Find class by name
      const index = await pack.getIndex();
      const classEntry = index.find((i: any) => i.name === className);
      
      if (!classEntry) {
        throw new Error(`Class '${className}' not found in compendium`);
      }

      // Get full class document
      const classDoc = await pack.getDocument(classEntry._id);
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
    primaryAbility: "str" | "dex" | "con" | "int" | "wis" | "cha" = "str"
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
        
        if (lvl === 1) {
          // First level: max HD
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
    skillList: Array<{ name: string; ranks: number }>
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

      // SIMPLIFIED APPROACH: Distribute points directly at each level
      // No scaling, no rounding - just direct allocation
      // Template's "ranks" field defines PRIORITY (higher = more important)
      
      const distributionPlan: Map<number, Map<string, number>> = new Map();
      
      // Initialize distribution plan for all levels
      for (let lvl = 1; lvl <= level; lvl++) {
        distributionPlan.set(lvl, new Map());
      }
      
      // Calculate total priority weight from template
      const totalPriorityWeight = skillList.reduce((sum, s) => sum + s.ranks, 0);
      
      console.log(`D35EAdapter | Distributing skill points across ${level} levels for ${skillList.length} skills`);
      
      // For each level, distribute that level's skill points proportionally
      for (let lvl = 1; lvl <= level; lvl++) {
        const pointsThisLevel = lvl === 1 ? skillPointsAtLevel1 : skillPointsPerLevel;
        let pointsRemaining = pointsThisLevel;
        
        // First pass: Distribute points proportionally based on template priority
        const allocations: Array<{ skill: string; points: number; remainder: number }> = [];
        
        for (const skillEntry of skillList) {
          const proportion = skillEntry.ranks / totalPriorityWeight;
          const exactPoints = pointsThisLevel * proportion;
          const basePoints = Math.floor(exactPoints);
          const remainder = exactPoints - basePoints;
          
          allocations.push({
            skill: skillEntry.name,
            points: basePoints,
            remainder: remainder
          });
          
          pointsRemaining -= basePoints;
        }
        
        // Second pass: Distribute remaining points to skills with highest remainders
        allocations.sort((a, b) => b.remainder - a.remainder);
        
        for (let i = 0; i < pointsRemaining && i < allocations.length; i++) {
          allocations[i].points++;
        }
        
        // Store in distribution plan
        for (const allocation of allocations) {
          if (allocation.points > 0) {
            distributionPlan.get(lvl)!.set(allocation.skill, allocation.points);
          }
        }
        
        // Verify exact point spending
        const totalSpent = allocations.reduce((sum, a) => sum + a.points, 0);
        console.log(`D35EAdapter | Level ${lvl}: Allocated ${totalSpent}/${pointsThisLevel} skill points`);
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
}
