import { TownieTemplate, TownieFormData } from "../types";
import { D35EAdapter } from "../d35e-adapter";
import { TOWNIE_TEMPLATES } from "../data/templates";
import { generateCharacterName } from "../data/character-names";

export class TownieMakerApp extends Application {
  private selectedTemplate: TownieTemplate | null = null;
  private formData: Partial<TownieFormData> = {};
  private availableRaces: Array<{ id: string; name: string }> = [];
  private availableClasses: Array<{ id: string; name: string }> = [];

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "motwm-townie-maker",
      title: "MOTWM Townie Maker",
      width: 720,
      height: 600,
      resizable: true,
      template: "modules/motwm-townie-maker/templates/townie-maker.hbs",
      classes: ["motwm-townie-maker"],
      tabs: [{ navSelector: ".tabs", contentSelector: ".content", initial: "template" }]
    });
  }

  async getData(): Promise<any> {
    // Load available races if not already loaded
    if (this.availableRaces.length === 0) {
      this.availableRaces = await D35EAdapter.getRaces();
      console.log("Available races:", this.availableRaces.map(r => r.name));
    }
    
    // Load available classes if not already loaded
    if (this.availableClasses.length === 0) {
      this.availableClasses = await D35EAdapter.getClasses();
    }

    const settings = {
      defaultActorType: game.settings.get("motwm-townie-maker", "defaultActorType"),
      autoRollHP: game.settings.get("motwm-townie-maker", "autoRollHP"),
      abilityScoreMethod: game.settings.get("motwm-townie-maker", "abilityScoreMethod"),
      defaultFolder: game.settings.get("motwm-townie-maker", "defaultFolder")
    };

    // Ability scores with labels
    const abilities = [
      { key: "str", label: "Strength", value: this.formData.abilities?.str ?? 10 },
      { key: "dex", label: "Dexterity", value: this.formData.abilities?.dex ?? 10 },
      { key: "con", label: "Constitution", value: this.formData.abilities?.con ?? 10 },
      { key: "int", label: "Intelligence", value: this.formData.abilities?.int ?? 10 },
      { key: "wis", label: "Wisdom", value: this.formData.abilities?.wis ?? 10 },
      { key: "cha", label: "Charisma", value: this.formData.abilities?.cha ?? 10 }
    ];

    return {
      templates: TOWNIE_TEMPLATES,
      selectedTemplate: this.selectedTemplate,
      formData: this.formData,
      abilities,
      settings,
      races: this.availableRaces,
      classes: this.availableClasses
    };
  }

  activateListeners(html: JQuery): void {
    super.activateListeners(html);

    // Template selection
    html.on("click", "[data-action='select-template']", (ev) => {
      const templateId = $(ev.currentTarget).data("template-id");
      this.selectTemplate(templateId);
    });

    // Form inputs
    html.on("change", "[data-field]", (ev) => {
      const field = $(ev.currentTarget).data("field");
      let value: any = $(ev.currentTarget).val();
      
      // Parse numeric fields
      if (field === "classLevel") {
        value = parseInt(value as string) || 1;
      }
      
      this.updateFormData(field, value);
    });

    // Ability score inputs
    html.on("change", "[data-ability]", (ev) => {
      const ability = $(ev.currentTarget).data("ability");
      const value = parseInt($(ev.currentTarget).val() as string) || 10;
      this.updateAbilityScore(ability, value);
    });

    // Apply standard array button
    html.on("click", "[data-action='apply-standard-array']", () => {
      this.applyStandardArray();
    });

    // Roll ability scores
    html.on("click", "[data-action='roll-abilities']", () => {
      this.rollAbilityScores();
    });

    // Randomize name button
    html.on("click", "[data-action='randomize-name']", () => {
      this.randomizeName();
    });

    // Create NPC button
    html.on("click", "[data-action='create-npc']", () => {
      this.createNPC();
    });

    // Cancel button
    html.on("click", "[data-action='cancel']", () => {
      this.close();
    });
  }

  private selectTemplate(templateId: string): void {
    this.selectedTemplate = TOWNIE_TEMPLATES.find(t => t.id === templateId) || null;
    
    if (this.selectedTemplate) {
      // Pre-fill form with template data
      this.formData.race = this.selectedTemplate.race || "";
      this.formData.classes = this.selectedTemplate.classes || [];
      this.formData.alignment = this.selectedTemplate.alignment || "";
      
      // Set first class name and level from template
      if (this.selectedTemplate.classes && this.selectedTemplate.classes.length > 0) {
        this.formData.className = this.selectedTemplate.classes[0].name;
        // Ensure level is always a number
        this.formData.classLevel = parseInt(this.selectedTemplate.classes[0].level as any) || 1;
      }
      
      // Apply ability score modifiers
      if (this.selectedTemplate.abilities) {
        this.formData.abilities = { ...this.selectedTemplate.abilities } as any;
      }
      
      // Auto-generate name for non-blank templates
      if (this.selectedTemplate.id !== 'blank' && this.formData.race && this.formData.className) {
        this.generateAndSetName();
      }
    }
    
    this.render(false);
  }

  private updateFormData(field: string, value: any): void {
    // @ts-ignore
    this.formData[field] = value;
  }

  private updateAbilityScore(ability: string, value: number): void {
    if (!this.formData.abilities) {
      this.formData.abilities = { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };
    }
    // @ts-ignore
    this.formData.abilities[ability] = value;
  }

  private applyStandardArray(): void {
    this.formData.abilities = {
      str: 15,
      dex: 14,
      con: 13,
      int: 12,
      wis: 10,
      cha: 8
    };
    this.render(false);
  }

  private rollAbilityScores(): void {
    const roll4d6DropLowest = () => {
      const rolls = [
        Math.ceil(Math.random() * 6),
        Math.ceil(Math.random() * 6),
        Math.ceil(Math.random() * 6),
        Math.ceil(Math.random() * 6)
      ].sort((a, b) => b - a);
      return rolls[0] + rolls[1] + rolls[2]; // Take top 3
    };

    this.formData.abilities = {
      str: roll4d6DropLowest(),
      dex: roll4d6DropLowest(),
      con: roll4d6DropLowest(),
      int: roll4d6DropLowest(),
      wis: roll4d6DropLowest(),
      cha: roll4d6DropLowest()
    };
    
    ui.notifications?.info("Ability scores rolled!");
    this.render(false);
  }

  private generateAndSetName(): void {
    if (!this.formData.race || !this.formData.className) {
      return;
    }
    
    // Default to male, but randomly select gender if not set
    const gender: 'male' | 'female' = this.formData.gender || (Math.random() < 0.5 ? 'male' : 'female');
    this.formData.gender = gender;
    
    const name = generateCharacterName(this.formData.race, this.formData.className, gender);
    this.formData.name = name;
  }

  private randomizeName(): void {
    if (!this.formData.race || !this.formData.className) {
      ui.notifications?.warn("Please select a race and class first");
      return;
    }
    
    // Toggle gender or pick randomly
    if (!this.formData.gender) {
      this.formData.gender = Math.random() < 0.5 ? 'male' : 'female';
    } else {
      // 50% chance to toggle gender, 50% chance to keep same
      if (Math.random() < 0.5) {
        this.formData.gender = this.formData.gender === 'male' ? 'female' : 'male';
      }
    }
    
    this.generateAndSetName();
    this.render(false);
  }

  private getPrimaryAbilityFromScores(
    scores: { str: number; dex: number; con: number; int: number; wis: number; cha: number }
  ): "str" | "dex" | "con" | "int" | "wis" | "cha" {
    // Find the ability with the highest score
    let highest: "str" | "dex" | "con" | "int" | "wis" | "cha" = "str";
    let highestValue = scores.str;
    
    for (const [key, value] of Object.entries(scores)) {
      if (value > highestValue) {
        highest = key as "str" | "dex" | "con" | "int" | "wis" | "cha";
        highestValue = value;
      }
    }
    
    return highest;
  }

  private async createNPC(): Promise<void> {
    const name = this.formData.name;
    if (!name) {
      ui.notifications?.warn("Please enter a name for the NPC");
      return;
    }

    const abilities = this.formData.abilities || { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };

    try {
      const actorType = game.settings.get("motwm-townie-maker", "defaultActorType") as "character" | "npc";
      const folder = game.settings.get("motwm-townie-maker", "defaultFolder") as string;
      const autoRollHP = game.settings.get("motwm-townie-maker", "autoRollHP") as boolean;

      // Create the actor
      const actor = await D35EAdapter.createActor({
        name,
        type: actorType,
        folder: folder || undefined
      });

      if (!actor) {
        throw new Error("Failed to create actor");
      }

      // Set ability scores
      await D35EAdapter.setAbilityScores(actor, abilities);

      // Add race if specified
      if (this.formData.race) {
        await D35EAdapter.addRace(actor, this.formData.race);
      }

      // Add class if specified (use className/classLevel or fall back to classes array)
      const className = this.formData.className || (this.formData.classes?.[0]?.name);
      const classLevel = parseInt(this.formData.classLevel as any) || parseInt(this.formData.classes?.[0]?.level as any) || 1;
      
      if (className) {
        await D35EAdapter.addClass(actor, className, classLevel);
      }

      // Roll HP if enabled (MUST be before addSkills to create levelUpData)
      if (autoRollHP) {
        // Get primary ability from template or default based on highest ability score
        const primaryAbility = this.selectedTemplate?.primaryAbility || this.getPrimaryAbilityFromScores(abilities);
        await D35EAdapter.rollHP(actor, classLevel, primaryAbility);
      }

      // Add skills from template if available (MUST be after rollHP creates levelUpData)
      if (this.selectedTemplate?.skills && this.selectedTemplate.skills.length > 0) {
        await D35EAdapter.addSkills(actor, classLevel, this.selectedTemplate.skills);
      }

      // Add feats from template if available
      if (this.selectedTemplate?.feats && this.selectedTemplate.feats.length > 0) {
        // Import feat selection system
        const { allocateFeats, RangerCombatStyle } = await import('../data/feat-selection');
        
        // Determine Ranger combat style if applicable
        let rangerStyle: any = undefined;
        if (className?.toLowerCase() === 'ranger') {
          if (this.selectedTemplate.rangerCombatStyle === 'archery') {
            rangerStyle = RangerCombatStyle.ARCHERY;
          } else if (this.selectedTemplate.rangerCombatStyle === 'two-weapon') {
            rangerStyle = RangerCombatStyle.TWO_WEAPON;
          }
        }
        
        // Allocate feats based on class, level, and race
        const isHuman = this.formData.race === "Human";
        const featAllocations = allocateFeats(
          className || 'Fighter', 
          classLevel, 
          isHuman,
          this.selectedTemplate.feats,
          rangerStyle
        );
        
        console.log(`TownieMakerApp | Feat allocations for ${className} level ${classLevel}:`, featAllocations);
        
        // Pass full allocation objects to preserve source information
        await D35EAdapter.addFeats(actor, classLevel, featAllocations, isHuman);
      }

      // Add Ranger favored enemies if applicable
      console.log(`TownieMakerApp | Checking favored enemies - className: ${className}, template: ${this.selectedTemplate?.id}, favoredEnemies:`, this.selectedTemplate?.favoredEnemies);
      if (className?.toLowerCase() === 'ranger' && 
          this.selectedTemplate?.favoredEnemies && 
          this.selectedTemplate.favoredEnemies.length > 0) {
        console.log(`TownieMakerApp | Adding favored enemies for level ${classLevel} Ranger`);
        await D35EAdapter.addFavoredEnemies(actor, classLevel, this.selectedTemplate.favoredEnemies);
      } else {
        console.log(`TownieMakerApp | Skipping favored enemies - conditions not met`);
      }

      // Add Rogue special abilities if applicable
      if (className?.toLowerCase() === 'rogue' && 
          this.selectedTemplate?.rogueSpecialAbilities && 
          this.selectedTemplate.rogueSpecialAbilities.length > 0) {
        console.log(`TownieMakerApp | Adding special abilities for level ${classLevel} Rogue`);
        await D35EAdapter.addRogueSpecialAbilities(actor, classLevel, this.selectedTemplate.rogueSpecialAbilities);
      }

      // Add spells for caster classes (MUST be after class/level set, before equipment)
      if (className) {
        console.log(`TownieMakerApp | About to call addSpells for ${className} level ${classLevel}`);
        console.log(`TownieMakerApp | Ability scores:`, abilities);
        await D35EAdapter.addSpells(actor, className, classLevel, abilities);
      } else {
        console.warn(`TownieMakerApp | No className set, skipping spell configuration`);
      }

      // Add equipment from template if available
      console.log("TownieMakerApp | About to call addEquipment...");
      console.log("TownieMakerApp | selectedTemplate:", this.selectedTemplate?.name);
      console.log("TownieMakerApp | has startingKit:", !!this.selectedTemplate?.startingKit);
      if (this.selectedTemplate) {
        await D35EAdapter.addEquipment(actor, this.selectedTemplate, classLevel);
        
        // IMPORTANT: Complete container moves AFTER character is fully created
        // This must happen after all other updates to avoid D35E's actor.refresh() resetting containers
        console.log("TownieMakerApp | Completing pending container moves...");
        await D35EAdapter.completePendingContainerMoves(actor);
      }
      console.log("TownieMakerApp | Finished addEquipment");

      // Generate attacks for all equipped weapons
      console.log("TownieMakerApp | Generating attacks...");
      await D35EAdapter.addAttacks(actor);
      console.log("TownieMakerApp | Finished generating attacks");

      // Set biography with personality and background
      if (this.formData.personality || this.formData.background) {
        await D35EAdapter.setBiography(actor, {
          personality: this.formData.personality,
          background: this.formData.background
        });
      }

      ui.notifications?.info(`Created ${name}!`);
      actor.sheet?.render(true);
      this.close();

    } catch (error) {
      console.error("Failed to create NPC:", error);
      ui.notifications?.error("Failed to create NPC. Check console for details.");
    }
  }
}
