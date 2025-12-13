import { TownieTemplate, TownieFormData } from "../types";
import { D35EAdapter } from "../d35e-adapter";
import { TOWNIE_TEMPLATES } from "../data/templates";
import { generateCharacterName, generateFirstName, generateSurname, generateClassTitle } from "../data/character-names";
import { resolveCharacterImages, normalizeGender, getDefaultImages } from "../data/image-resolver";

// Module-level storage for Config tab settings that persists between app opens
// This resets on page reload but persists during the session
let persistedConfigSettings: {
  useStandardBudget?: boolean;
  usePcSheet?: boolean;
  useMaxHpPerHD?: boolean;
  magicItemBudgets?: {
    shieldPercent?: number;
    armorPercent?: number;
    secondaryWeaponPercent?: number;
    ringPercent?: number;
    amuletPercent?: number;
  };
} | null = null;

export class TownieMakerApp extends Application {
  private selectedTemplate: TownieTemplate | null = null;
  private formData: Partial<TownieFormData> = {
    magicItemBudgets: {}, // Initialize budget object
    useStandardBudget: true, // Default to standard adventurer budget
    usePcSheet: true, // Default to PC sheet
    useMaxHpPerHD: false // Default to rolling HP
  };
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

  /**
   * Get the default budget percentages based on level and template
   */
  private getDefaultBudgets(): { [key: string]: number } {
    const level = this.formData.classLevel || 1;
    
    // Check if template has budget overrides
    const templateBudgets = this.selectedTemplate?.magicItemBudgets;
    
    // Level-dependent hardcoded defaults
    const shieldDefault = level >= 17 ? 50 : 40;
    const armorDefault = level >= 17 ? 50 : 60;
    
    return {
      shieldPercent: templateBudgets?.shieldPercent !== undefined 
        ? Math.round(templateBudgets.shieldPercent * 100)
        : shieldDefault,
      armorPercent: templateBudgets?.armorPercent !== undefined 
        ? Math.round(templateBudgets.armorPercent * 100)
        : armorDefault,
      secondaryWeaponPercent: templateBudgets?.secondaryWeaponPercent !== undefined 
        ? Math.round(templateBudgets.secondaryWeaponPercent * 100)
        : 50,
      ringPercent: templateBudgets?.ringPercent !== undefined 
        ? Math.round(templateBudgets.ringPercent * 100)
        : 60,
      amuletPercent: templateBudgets?.amuletPercent !== undefined 
        ? Math.round(templateBudgets.amuletPercent * 100)
        : 40
    };
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
    
    // Load persisted Config settings if available (first open after page load)
    if (persistedConfigSettings) {
      // Only restore config settings if they haven't been overwritten by template selection
      if (this.formData.useStandardBudget === undefined || !this.selectedTemplate) {
        this.formData.useStandardBudget = persistedConfigSettings.useStandardBudget ?? true;
      }
      if (this.formData.usePcSheet === undefined || !this.selectedTemplate) {
        this.formData.usePcSheet = persistedConfigSettings.usePcSheet ?? true;
      }
      if (this.formData.useMaxHpPerHD === undefined || !this.selectedTemplate) {
        this.formData.useMaxHpPerHD = persistedConfigSettings.useMaxHpPerHD ?? false;
      }
      if (!this.formData.magicItemBudgets || Object.keys(this.formData.magicItemBudgets).length === 0) {
        this.formData.magicItemBudgets = persistedConfigSettings.magicItemBudgets || {};
      }
    } else {
      // Initialize usePcSheet from settings if not already set
      if (this.formData.usePcSheet === undefined) {
        const defaultSheetType = game.settings.get("motwm-townie-maker", "defaultSheetType") as string;
        this.formData.usePcSheet = defaultSheetType !== 'simpleNpc';
      }
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

    // Get default budgets
    const defaultBudgets = this.getDefaultBudgets();
    
    // Format budget percentages for display (use current value or default)
    const magicItemBudgets = {
      shieldPercent: this.formData.magicItemBudgets?.shieldPercent !== undefined 
        ? Math.round(this.formData.magicItemBudgets.shieldPercent * 100) 
        : defaultBudgets.shieldPercent,
      armorPercent: this.formData.magicItemBudgets?.armorPercent !== undefined 
        ? Math.round(this.formData.magicItemBudgets.armorPercent * 100) 
        : defaultBudgets.armorPercent,
      secondaryWeaponPercent: this.formData.magicItemBudgets?.secondaryWeaponPercent !== undefined 
        ? Math.round(this.formData.magicItemBudgets.secondaryWeaponPercent * 100) 
        : defaultBudgets.secondaryWeaponPercent,
      ringPercent: this.formData.magicItemBudgets?.ringPercent !== undefined 
        ? Math.round(this.formData.magicItemBudgets.ringPercent * 100) 
        : defaultBudgets.ringPercent,
      amuletPercent: this.formData.magicItemBudgets?.amuletPercent !== undefined 
        ? Math.round(this.formData.magicItemBudgets.amuletPercent * 100) 
        : defaultBudgets.amuletPercent
    };

    // Calculate wealth and magic budget for display
    let totalWealth = 0;
    let magicBudget = 0;
    let budgetInfo = null;
    
    if (this.formData.classLevel && this.formData.className) {
      // Import wealth calculation (dynamic to avoid circular deps)
      const { getWealthForLevel } = await import('../data/wealth');
      const { calculateKitCost } = await import('../data/equipment-resolver');
      const { MAGIC_ITEM_BUDGET_ALLOCATION, getClassType } = await import('../data/magic-item-system');
      
      const level = this.formData.classLevel;
      const className = this.formData.className;
      
      totalWealth = getWealthForLevel(level, className);
      
      // Calculate mundane equipment cost if template has starting kit
      let mundaneCost = 0;
      if (this.selectedTemplate?.startingKit) {
        mundaneCost = calculateKitCost(this.selectedTemplate.startingKit, level);
      }
      
      magicBudget = totalWealth - mundaneCost;
      
      // Determine class type for budget allocation
      const classType = getClassType(className);
      const normalizedClassLower = className.toLowerCase();
      const isPaladinOrRanger = normalizedClassLower === 'paladin' || normalizedClassLower === 'ranger';
      const budgetAllocation = isPaladinOrRanger 
        ? MAGIC_ITEM_BUDGET_ALLOCATION.partialCasterMartial
        : (classType === 'martial' ? MAGIC_ITEM_BUDGET_ALLOCATION.martial : MAGIC_ITEM_BUDGET_ALLOCATION.caster);
      
      // Calculate parent budget categories
      const weaponBudgetTotal = Math.floor(magicBudget * budgetAllocation.weapon);
      const armorBudgetTotal = Math.floor(magicBudget * budgetAllocation.armor);
      const protectionBudgetTotal = Math.floor(magicBudget * budgetAllocation.protection);
      
      // Calculate GP values for each sub-category (percentages of parent budgets)
      const shieldGP = Math.round(armorBudgetTotal * (magicItemBudgets.shieldPercent / 100));
      const armorGP = Math.round(armorBudgetTotal * (magicItemBudgets.armorPercent / 100));
      const secondaryWeaponGP = Math.round(weaponBudgetTotal * (magicItemBudgets.secondaryWeaponPercent / 100));
      const ringGP = Math.round(protectionBudgetTotal * (magicItemBudgets.ringPercent / 100));
      const amuletGP = Math.round(protectionBudgetTotal * (magicItemBudgets.amuletPercent / 100));
      
      // Calculate total allocated and unallocated (within their respective parent budgets)
      const totalAllocatedPercent = magicItemBudgets.shieldPercent + 
                                    magicItemBudgets.armorPercent + 
                                    magicItemBudgets.secondaryWeaponPercent + 
                                    magicItemBudgets.ringPercent + 
                                    magicItemBudgets.amuletPercent;
      const unallocatedPercent = Math.max(0, 100 - totalAllocatedPercent);
      
      // Calculate unallocated GP from each parent budget
      const armorUnallocated = armorBudgetTotal - shieldGP - armorGP;
      const weaponUnallocated = weaponBudgetTotal - secondaryWeaponGP - (weaponBudgetTotal * 0.5); // Primary takes 50%
      const protectionUnallocated = protectionBudgetTotal - ringGP - amuletGP;
      const unallocatedGP = Math.max(0, armorUnallocated + weaponUnallocated + protectionUnallocated);
      
      budgetInfo = {
        totalWealth,
        mundaneCost,
        magicBudget,
        weaponBudgetTotal,
        armorBudgetTotal,
        protectionBudgetTotal,
        shieldGP,
        armorGP,
        secondaryWeaponGP,
        ringGP,
        amuletGP,
        totalAllocatedPercent,
        unallocatedPercent,
        unallocatedGP
      };
    }

    return {
      templates: TOWNIE_TEMPLATES,
      selectedTemplate: this.selectedTemplate,
      formData: {
        ...this.formData,
        magicItemBudgets
      },
      abilities,
      settings,
      races: this.availableRaces,
      classes: this.availableClasses,
      budgetInfo
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
      
      // Handle checkboxes specially
      if (field === "useStandardBudget" || field === "usePcSheet" || field === "useMaxHpPerHD") {
        value = $(ev.currentTarget).is(':checked');
        // @ts-ignore
        this.formData[field] = value;
        // Persist config settings
        this.persistConfigSettings();
        this.render(false);
        return;
      }
      
      // Parse numeric fields
      if (field === "classLevel") {
        value = parseInt(value as string) || 1;
        
        // Check if level crosses the 17 threshold and budgets haven't been customized
        const oldLevel = this.formData.classLevel || 1;
        const newLevel = value;
        
        // If crossing threshold and no custom budgets set, update to new defaults
        if ((oldLevel < 17 && newLevel >= 17) || (oldLevel >= 17 && newLevel < 17)) {
          // Only auto-update if user hasn't customized budgets
          if (!this.formData.magicItemBudgets || Object.keys(this.formData.magicItemBudgets).length === 0) {
            // Will be auto-populated with new defaults on render
            this.formData.magicItemBudgets = {};
          }
        }
      }
      
      this.updateFormData(field, value);
      
      // Smart name regeneration based on what changed
      if (field === "race" && this.formData.race && this.formData.className && this.formData.name) {
        // Race changed: regenerate first + last name, keep class title
        this.regenerateRacialName();
        this.render(false);
      } else if (field === "gender" && this.formData.gender && this.formData.name) {
        // Gender changed: only regenerate first name
        this.regenerateFirstName();
        this.render(false);
      } else if (field === "className" && this.formData.className && this.formData.race && this.formData.name) {
        // Class changed: only regenerate class title
        this.regenerateClassTitle();
        this.render(false);
      } else if (field === "classLevel") {
        // Level changed: re-render to update budget defaults
        this.render(false);
      }
    });

    // Ability score inputs
    html.on("change", "[data-ability]", (ev) => {
      const ability = $(ev.currentTarget).data("ability");
      const value = parseInt($(ev.currentTarget).val() as string) || 10;
      this.updateAbilityScore(ability, value);
    });

    // Budget percentage inputs
    html.on("change", "[data-budget]", (ev) => {
      const budgetField = $(ev.currentTarget).data("budget");
      const value = $(ev.currentTarget).val();
      
      // If empty string, delete the override to use default
      if (value === "" || value === null || value === undefined) {
        if (this.formData.magicItemBudgets) {
          delete this.formData.magicItemBudgets[budgetField];
        }
      } else {
        const numValue = parseFloat(value as string);
        if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
          if (!this.formData.magicItemBudgets) {
            this.formData.magicItemBudgets = {};
          }
          // Convert percentage to decimal (e.g., 50 -> 0.5)
          this.formData.magicItemBudgets[budgetField] = numValue / 100;
        }
      }
      // Persist config settings
      this.persistConfigSettings();
      console.log("Budget updated:", budgetField, this.formData.magicItemBudgets);
    });

    // Reset budgets button - restore to current defaults
    html.on("click", "[data-action='reset-budgets']", () => {
      // Get the current defaults based on level and template
      const defaults = this.getDefaultBudgets();
      
      // Set form data to the default values (as decimals)
      this.formData.magicItemBudgets = {
        shieldPercent: defaults.shieldPercent / 100,
        armorPercent: defaults.armorPercent / 100,
        secondaryWeaponPercent: defaults.secondaryWeaponPercent / 100,
        ringPercent: defaults.ringPercent / 100,
        amuletPercent: defaults.amuletPercent / 100
      };
      
      this.render(false);
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

    // Create NPC button - use mousedown to fire before blur/change events
    // This prevents the double-click issue when an input field has focus
    html.on("mousedown", "[data-action='create-npc']", (ev) => {
      ev.preventDefault(); // Prevent focus change
      this.createNPC();
    });

    // Cancel button
    html.on("click", "[data-action='cancel']", () => {
      this.close();
    });
  }

  private selectTemplate(templateId: string): void {
    // Save scroll position of the template tab before re-render
    const templateTab = this.element?.find('.tab[data-tab="template"]');
    const scrollTop = templateTab?.scrollTop() || 0;
    
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
      
      // Load magic item budget overrides from template
      if (this.selectedTemplate.magicItemBudgets) {
        this.formData.magicItemBudgets = { ...this.selectedTemplate.magicItemBudgets };
      } else {
        this.formData.magicItemBudgets = {};
      }
      
      // Load useStandardBudget from template (default to true if not specified)
      this.formData.useStandardBudget = this.selectedTemplate.useStandardBudget !== false;
      
      // Load usePcSheet from template (default to true if not specified)
      this.formData.usePcSheet = this.selectedTemplate.usePcSheet !== false;
      
      // Load useMaxHpPerHD from template (default to false if not specified)
      this.formData.useMaxHpPerHD = this.selectedTemplate.useMaxHpPerHD === true;
      
      // Auto-generate name for non-blank templates
      if (this.selectedTemplate.id !== 'blank' && this.formData.race && this.formData.className) {
        this.generateAndSetName();
      }
    }
    
    // Render and restore scroll position
    this.render(false).then(() => {
      // Restore scroll position after render completes
      if (scrollTop > 0) {
        const newTemplateTab = this.element?.find('.tab[data-tab="template"]');
        newTemplateTab?.scrollTop(scrollTop);
      }
    });
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

  /**
   * Persist Config tab settings to module-level storage
   * These persist between app opens but reset on page reload
   */
  private persistConfigSettings(): void {
    persistedConfigSettings = {
      useStandardBudget: this.formData.useStandardBudget,
      usePcSheet: this.formData.usePcSheet,
      useMaxHpPerHD: this.formData.useMaxHpPerHD,
      magicItemBudgets: this.formData.magicItemBudgets ? { ...this.formData.magicItemBudgets } : {}
    };
    console.log("TownieMakerApp | Persisted config settings:", persistedConfigSettings);
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

  /**
   * Regenerate only the first name (used when gender changes)
   */
  private regenerateFirstName(): void {
    if (!this.formData.race || !this.formData.gender || !this.formData.name) {
      return;
    }

    const currentName = this.formData.name;
    const nameParts = currentName.split(' ');
    
    if (nameParts.length === 0) {
      return;
    }

    // Generate new first name
    const newFirstName = generateFirstName(this.formData.race, this.formData.gender);
    
    // Replace first name, keep everything else
    nameParts[0] = newFirstName;
    this.formData.name = nameParts.join(' ');
  }

  /**
   * Regenerate first and last name, preserve class title if present (used when race changes)
   */
  private regenerateRacialName(): void {
    if (!this.formData.race || !this.formData.className || !this.formData.name) {
      return;
    }

    const currentName = this.formData.name;
    const nameParts = currentName.split(' ');
    
    if (nameParts.length === 0) {
      return;
    }

    // Generate new first and last name
    const newFirstName = generateFirstName(this.formData.race, this.formData.gender || 'male');
    const newSurname = generateSurname(this.formData.race);
    
    // Check if there was a title (3+ parts means title exists)
    if (nameParts.length >= 3) {
      // Keep the title (everything after the surname)
      const title = nameParts.slice(2).join(' ');
      this.formData.name = `${newFirstName} ${newSurname} ${title}`;
    } else {
      this.formData.name = `${newFirstName} ${newSurname}`;
    }
  }

  /**
   * Regenerate class title only (used when class changes)
   */
  private regenerateClassTitle(): void {
    if (!this.formData.race || !this.formData.className || !this.formData.name) {
      return;
    }

    const currentName = this.formData.name;
    const nameParts = currentName.split(' ');
    
    if (nameParts.length < 2) {
      return;
    }

    // Generate new class title
    const newTitle = generateClassTitle(this.formData.race, this.formData.className);
    
    // Keep first and last name, replace or add title
    const firstName = nameParts[0];
    const surname = nameParts[1];
    
    if (newTitle) {
      this.formData.name = `${firstName} ${surname} ${newTitle}`;
    } else {
      // No title generated, just use first and last name
      this.formData.name = `${firstName} ${surname}`;
    }
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

  /**
   * Show/hide the loading overlay
   */
  private setLoading(show: boolean, step?: string, progress?: number): void {
    const overlay = this.element.find('.loading-overlay');
    const stepEl = overlay.find('.loading-step');
    const progressBar = overlay.find('.loading-progress-bar');
    
    if (show) {
      overlay.css('display', 'flex');
      if (step) {
        stepEl.text(step);
      }
      if (progress !== undefined) {
        progressBar.css('width', `${progress}%`);
      }
    } else {
      overlay.hide();
      stepEl.text('');
      progressBar.css('width', '0%');
    }
  }

  /**
   * Update just the loading step text and progress
   */
  private updateLoadingStep(step: string, progress: number): void {
    const overlay = this.element.find('.loading-overlay');
    overlay.find('.loading-step').text(step);
    overlay.find('.loading-progress-bar').css('width', `${progress}%`);
  }

  private async createNPC(): Promise<void> {
    const name = this.formData.name;
    if (!name) {
      ui.notifications?.warn("Please enter a name for the NPC");
      return;
    }

    const abilities = this.formData.abilities || { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };

    // Show loading overlay
    this.setLoading(true, 'Initializing...', 0);

    try {
      // Determine actor type based on sheet type selection
      const usePcSheet = this.formData.usePcSheet !== false;
      const actorType = usePcSheet ? 'character' : 'npc';
      const useMaxHp = this.formData.useMaxHpPerHD === true;
      
      const folder = game.settings.get("motwm-townie-maker", "defaultFolder") as string;
      const autoRollHP = game.settings.get("motwm-townie-maker", "autoRollHP") as boolean;
      
      console.log(`TownieMakerApp | Creating actor - usePcSheet: ${usePcSheet}, actorType: ${actorType}, useMaxHp: ${useMaxHp}`);

      // Resolve character images based on race, class, and gender
      this.updateLoadingStep('Resolving character images...', 5);
      const className = this.formData.className || (this.formData.classes?.[0]?.name);
      const gender = normalizeGender(this.formData.gender);
      let characterImages = getDefaultImages();
      
      if (this.formData.race && className) {
        const resolvedImages = await resolveCharacterImages(
          this.formData.race,
          className,
          gender
        );
        if (resolvedImages) {
          characterImages = resolvedImages;
          console.log(`TownieMakerApp | Resolved images - Portrait: ${characterImages.portrait}, Token: ${characterImages.token}`);
        } else {
          console.log(`TownieMakerApp | No images found for ${this.formData.race} ${className}, using defaults`);
        }
      }

      // Create the actor with portrait and token images
      this.updateLoadingStep('Creating actor...', 10);
      const actor = await D35EAdapter.createActor({
        name,
        type: actorType,
        folder: folder || undefined,
        img: characterImages.portrait,
        tokenImg: characterImages.token
      });

      if (!actor) {
        throw new Error("Failed to create actor");
      }

      // Set ability scores
      this.updateLoadingStep('Setting ability scores...', 15);
      await D35EAdapter.setAbilityScores(actor, abilities);

      // Add race if specified
      if (this.formData.race) {
        this.updateLoadingStep(`Adding race: ${this.formData.race}...`, 20);
        await D35EAdapter.addRace(actor, this.formData.race);
      }

      // Add class if specified (use className/classLevel or fall back to classes array)
      const classLevel = parseInt(this.formData.classLevel as any) || parseInt(this.formData.classes?.[0]?.level as any) || 1;
      
      // Branch based on sheet type
      if (!usePcSheet) {
        // SIMPLE NPC SHEET PATH
        // Uses manual HP and simplified level tracking
        
        if (className) {
          this.updateLoadingStep(`Adding class: ${className} (Level ${classLevel})...`, 25);
          const hitDie = await D35EAdapter.addNpcClass(actor, className, classLevel);
          
          // Calculate and set HP for NPC (pass className to set system.classes.X.hp)
          if (autoRollHP) {
            this.updateLoadingStep('Calculating hit points...', 30);
            const conMod = Math.floor((abilities.con - 10) / 2);
            await D35EAdapter.calculateAndSetNpcHP(actor, classLevel, hitDie, conMod, useMaxHp, className);
          }
        }
        
        // Simple NPC sheets don't use levelUpData, so skip skills that depend on it
        // Skills and feats would need to be added differently for NPCs (future enhancement)
        console.log(`TownieMakerApp | Simple NPC sheet - skipping levelUpData-dependent features`);
        
      } else {
        // PC SHEET PATH
        // Uses full class progression with levelUpData
        
        if (className) {
          this.updateLoadingStep(`Adding class: ${className} (Level ${classLevel})...`, 25);
          await D35EAdapter.addClass(actor, className, classLevel);
        }

        // Roll HP if enabled (MUST be before addSkills to create levelUpData)
        if (autoRollHP) {
          this.updateLoadingStep('Rolling hit points...', 30);
          // Get primary ability from template or default based on highest ability score
          const primaryAbility = this.selectedTemplate?.primaryAbility || this.getPrimaryAbilityFromScores(abilities);
          await D35EAdapter.rollHP(actor, classLevel, primaryAbility, useMaxHp);
        }

        // Add skills from template if available (MUST be after rollHP creates levelUpData)
        if (this.selectedTemplate?.skills && this.selectedTemplate.skills.length > 0) {
          this.updateLoadingStep('Adding skills...', 35);
          await D35EAdapter.addSkills(actor, classLevel, this.selectedTemplate.skills);
        }
      }
      // END OF PC/NPC BRANCHING - Common code follows

      // Add feats from template if available
      if (this.selectedTemplate?.feats && this.selectedTemplate.feats.length > 0) {
        this.updateLoadingStep('Adding feats...', 40);
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
        this.updateLoadingStep('Adding favored enemies...', 50);
        console.log(`TownieMakerApp | Adding favored enemies for level ${classLevel} Ranger`);
        await D35EAdapter.addFavoredEnemies(actor, classLevel, this.selectedTemplate.favoredEnemies);
      } else {
        console.log(`TownieMakerApp | Skipping favored enemies - conditions not met`);
      }

      // Add Rogue special abilities if applicable
      if (className?.toLowerCase() === 'rogue' && 
          this.selectedTemplate?.rogueSpecialAbilities && 
          this.selectedTemplate.rogueSpecialAbilities.length > 0) {
        this.updateLoadingStep('Adding special abilities...', 50);
        console.log(`TownieMakerApp | Adding special abilities for level ${classLevel} Rogue`);
        await D35EAdapter.addRogueSpecialAbilities(actor, classLevel, this.selectedTemplate.rogueSpecialAbilities);
      }

      // Add spells for caster classes (MUST be after class/level set, before equipment)
      if (className) {
        this.updateLoadingStep('Configuring spells...', 55);
        console.log(`TownieMakerApp | About to call addSpells for ${className} level ${classLevel}`);
        console.log(`TownieMakerApp | Ability scores:`, abilities);
        await D35EAdapter.addSpells(actor, className, classLevel, abilities);
      } else {
        console.warn(`TownieMakerApp | No className set, skipping spell configuration`);
      }

      // Add equipment from template if available
      this.updateLoadingStep('Adding equipment & magic items...', 65);
      console.log("TownieMakerApp | About to call addEquipment...");
      console.log("TownieMakerApp | selectedTemplate:", this.selectedTemplate?.name);
      console.log("TownieMakerApp | has startingKit:", !!this.selectedTemplate?.startingKit);
      console.log("TownieMakerApp | useStandardBudget:", this.formData.useStandardBudget);
      if (this.selectedTemplate) {
        // Merge form data budget overrides into template for this creation
        const templateWithOverrides = {
          ...this.selectedTemplate,
          magicItemBudgets: this.formData.magicItemBudgets && Object.keys(this.formData.magicItemBudgets).length > 0
            ? this.formData.magicItemBudgets
            : this.selectedTemplate.magicItemBudgets,
          // Pass useStandardBudget from form (defaults to true if not explicitly set)
          useStandardBudget: this.formData.useStandardBudget !== false
        };
        
        await D35EAdapter.addEquipment(actor, templateWithOverrides, classLevel);
        
        // IMPORTANT: Complete container moves AFTER character is fully created
        this.updateLoadingStep('Organizing inventory...', 80);
        console.log("TownieMakerApp | Completing pending container moves...");
        await D35EAdapter.completePendingContainerMoves(actor);
      }
      console.log("TownieMakerApp | Finished addEquipment");

      // Generate attacks for all equipped weapons
      this.updateLoadingStep('Generating attacks...', 85);
      console.log("TownieMakerApp | Generating attacks...");
      await D35EAdapter.addAttacks(actor);
      console.log("TownieMakerApp | Finished generating attacks");

      // Set biography with personality and background
      if (this.formData.personality || this.formData.background) {
        this.updateLoadingStep('Setting biography...', 90);
        await D35EAdapter.setBiography(actor, {
          personality: this.formData.personality,
          background: this.formData.background
        });
      }

      // FINAL STEP: Re-apply token image after all D35E updates
      // D35E's actorUpdater overwrites the token image during various updates,
      // so we need to set it again at the very end
      if (characterImages.token !== characterImages.portrait) {
        this.updateLoadingStep('Finalizing token...', 95);
        console.log("TownieMakerApp | Re-applying token image after D35E updates...");
        await D35EAdapter.setTokenImage(actor, characterImages.token);
      }

      this.updateLoadingStep('Complete!', 100);
      
      // Small delay to show completion before closing
      await new Promise(resolve => setTimeout(resolve, 300));

      this.setLoading(false);
      ui.notifications?.info(`Created ${name}!`);
      actor.sheet?.render(true);
      this.close();

    } catch (error) {
      console.error("Failed to create NPC:", error);
      this.setLoading(false);
      ui.notifications?.error("Failed to create NPC. Check console for details.");
    }
  }
}
