/**
 * Ranger Favored Enemy Configuration System
 * 
 * Handles automatic creation of Ranger favored enemy class features
 * based on level and template configuration.
 */

/**
 * Favored enemy configuration
 */
export interface FavoredEnemyConfig {
  type: string;        // Enemy type (e.g., "Undead", "Dragon", "Humanoid (Orc)")
  level: number;       // Boost level: 1 = +2, 2 = +4, 3 = +6, etc.
  gainedAtLevel: number; // Ranger level when this enemy was gained (1, 5, 10, 15, or 20)
}

/**
 * Calculate favored enemies for a Ranger based on level and template
 * 
 * Rules:
 * - 1st, 5th, 10th, 15th, 20th: Gain new favored enemy
 * - 5th, 10th, 15th, 20th: Boost one existing enemy by +2
 * 
 * @param rangerLevel Current Ranger level
 * @param enemyTypes Array of enemy types from template (in order of preference)
 * @returns Array of favored enemy configurations
 */
export function calculateFavoredEnemies(
  rangerLevel: number,
  enemyTypes: string[]
): FavoredEnemyConfig[] {
  const configs: FavoredEnemyConfig[] = [];
  
  // Levels when favored enemies are gained
  const gainLevels = [1, 5, 10, 15, 20].filter(lvl => lvl <= rangerLevel);
  
  // Levels when boosts are available (same as gain levels except 1st)
  const boostLevels = [5, 10, 15, 20].filter(lvl => lvl <= rangerLevel);
  
  // Track which enemies have been added
  let enemyIndex = 0;
  
  // Add new enemies at gain levels
  for (const gainLevel of gainLevels) {
    if (enemyIndex < enemyTypes.length) {
      configs.push({
        type: enemyTypes[enemyIndex],
        level: 1, // Start at +2 bonus
        gainedAtLevel: gainLevel
      });
      enemyIndex++;
    }
  }
  
  // Apply boosts (strategy: boost oldest/most important enemies first)
  for (let i = 0; i < boostLevels.length && i < configs.length; i++) {
    configs[i].level++;
  }
  
  return configs;
}

/**
 * Generate favored enemy item data for D35E system
 * 
 * @param config Favored enemy configuration
 * @returns Item data object ready to be added to actor
 */
export function createFavoredEnemyItemData(config: FavoredEnemyConfig): any {
  const bonus = config.level * 2;
  
  return {
    name: `Favored Enemy (${config.type}, +${bonus})`,
    type: "feat",
    img: "systems/D35E/icons/classfeatures/favored-enemy.png",
    system: {
      description: {
        value: `<p class="p1">At 1st level, a ranger may select a type of creature from among those given on Table: Ranger Favored Enemies. The ranger gains a +2 bonus on Bluff, Listen, Sense Motive, Spot, and Survival checks when using these skills against creatures of this type. Likewise, he gets a +2 bonus on weapon damage rolls against such creatures.</p>
<p class="p1">At 5th level and every five levels thereafter (10th, 15th, and 20th level), the ranger may select an additional favored enemy from those given on the table. In addition, at each such interval, the bonus against any one favored enemy (including the one just selected, if so desired) increases by +2.</p>
<p class="p1">If the ranger chooses humanoids or outsiders as a favored enemy, he must also choose an associated subtype, as indicated on the table. If a specific creature falls into more than one category of favored enemy, the ranger's bonuses do not stack; he simply uses whichever bonus is higher.</p>
<p class="p2" style="min-height: 13px;"><em>Set Level custom attribute to 2 if you have improved this favored enemy type once, to 3 if twice.</em></p>`,
        chat: "",
        unidentified: ""
      },
      nameFormula: "Favored Enemy (${this.custom.favoredenemytype}, +${this.custom.level*2})",
      nameFromFormula: true,
      uniqueId: `rng-fav-Ranger-${config.gainedAtLevel}`,
      addedLevel: config.gainedAtLevel,
      source: `Ranger ${config.gainedAtLevel}`,
      classSource: "",
      userNonRemovable: true,
      customAttributes: {
        _o3zfw6g43: {
          id: "_o3zfw6g43",
          name: "Favored Enemy Type",
          value: config.type,
          selectList: "",
          showOnDetails: false
        },
        _ar55qs0iq: {
          id: "_ar55qs0iq",
          name: "Level",
          value: config.level.toString(),
          selectList: "",
          showOnDetails: false
        }
      },
      customAttributesLocked: false,
      activation: {
        cost: 1,
        type: ""
      },
      duration: {
        value: null,
        units: ""
      },
      target: {
        value: ""
      },
      range: {
        value: null,
        units: "",
        long: null
      },
      uses: {
        value: 0,
        max: 0,
        per: null,
        autoDeductCharges: true,
        allowMultipleUses: false,
        chargesPerUse: 1,
        maxPerUse: null,
        maxPerUseFormula: "",
        maxFormula: "",
        rechargeFormula: null,
        isResource: false,
        canBeLinked: false
      },
      abilityType: "na",
      actionType: "",
      attackBonus: "",
      critConfirmBonus: "",
      damage: {
        parts: [],
        alternativeParts: []
      },
      summon: [],
      attackParts: [],
      conditionals: [],
      contextNotes: [
        {
          text: "+[[( 2 * @item.custom.level )]] against ${this.item.custom.favoredenemytype} (Favored Enemy)",
          subTarget: "attack",
          target: "attack"
        },
        {
          text: "+[[( 2 * @item.custom.level )]] against ${this.item.custom.favoredenemytype} (Favored Enemy)",
          subTarget: "effect",
          target: "attack"
        },
        {
          text: "+[[( 2 * @item.custom.level )]] against ${this.item.custom.favoredenemytype} (Favored Enemy)",
          subTarget: "attack",
          target: "damage"
        },
        {
          text: "+[[( 2 * @item.custom.level )]] against ${this.item.custom.favoredenemytype} (Favored Enemy)",
          subTarget: "effect",
          target: "damage"
        },
        {
          text: "+[[( 2 * @item.custom.level )]] against ${this.item.custom.favoredenemytype} (Favored Enemy)",
          subTarget: "skill",
          target: "skills"
        }
      ],
      specialActions: [],
      attackType: "",
      ability: {
        attack: "",
        damage: "",
        damageMult: 1,
        critRange: 20,
        critMult: 2
      },
      effectNotes: "",
      attackNotes: "",
      measureTemplate: {
        type: "",
        size: 0,
        overrideColor: false,
        customColor: "",
        overrideTexture: false,
        customTexture: ""
      },
      creationChanges: [],
      changes: [],
      changeFlags: {
        loseDexToAC: false,
        noStr: false,
        mediumArmorFullSpeed: false,
        heavyArmorFullSpeed: false
      },
      links: {
        children: []
      },
      tag: "",
      useCustomTag: false,
      flags: {
        boolean: {},
        dictionary: {}
      },
      scriptCalls: [],
      combatChanges: [],
      combatChangesRange: {
        maxFormula: "",
        max: 0
      },
      combatChangesAdditionalRanges: {
        hasAdditionalRanges: false,
        slider1: {
          maxFormula: "",
          max: 0,
          name: ""
        },
        slider2: {
          maxFormula: "",
          max: 0,
          name: ""
        },
        slider3: {
          maxFormula: "",
          max: 0,
          name: ""
        }
      },
      combatChangesUsesCost: "chargesPerUse",
      combatChangesApplySpecialActionsOnce: true,
      combatChangeCustomDisplayName: "",
      combatChangeCustomReferenceName: "",
      sizeOverride: "",
      counterName: "",
      resistances: [],
      damageReduction: [],
      requirements: [],
      requiresPsionicFocus: false,
      creationChangesRequiresPsionicFocus: false,
      sustainedByPsionicFocus: false,
      specialPrepared: false,
      school: "none",
      sr: false,
      pr: false,
      shortDescription: "",
      spellDurationData: {
        value: "",
        units: ""
      },
      components: {
        value: "",
        verbal: false,
        somatic: false,
        material: false,
        focus: false,
        divineFocus: 0
      },
      materials: {
        value: "",
        consumed: {
          value: false,
          _deprecated: true
        },
        focus: ""
      },
      metamagicFeats: {
        maximized: false,
        empowered: false,
        enlarged: false,
        extended: false,
        heightened: false,
        quickened: false,
        silent: false,
        still: false,
        widened: false,
        persistent: false
      },
      effectNotesHTML: `+${bonus} on Bluff, Listen, Sense Motive, Spot, and Survival checks against ${config.type}. +${bonus} damage against ${config.type}.`,
      ability2: "",
      ability3: "",
      ability4: "",
      ability5: "",
      ability6: ""
    }
  };
}

/**
 * Example usage:
 * 
 * For a level 12 Ranger with enemies: ["Humanoid (Orc)", "Giant", "Magical Beast", "Dragon"]
 * 
 * Level 1: Gain "Humanoid (Orc)" (+2, level=1)
 * Level 5: Gain "Giant" (+2, level=1) + Boost "Humanoid (Orc)" to (+4, level=2)
 * Level 10: Gain "Magical Beast" (+2, level=1) + Boost "Giant" to (+4, level=2)
 * 
 * Result:
 * - Humanoid (Orc): +4 (level=2, gainedAtLevel=1)
 * - Giant: +4 (level=2, gainedAtLevel=5)
 * - Magical Beast: +2 (level=1, gainedAtLevel=10)
 */
