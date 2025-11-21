import { TownieTemplate, TownieFormData } from "../types";
import { D35EAdapter } from "../d35e-adapter";
import { TOWNIE_TEMPLATES } from "../data/templates";

export class TownieMakerApp extends Application {
  private selectedTemplate: TownieTemplate | null = null;
  private formData: Partial<TownieFormData> = {};

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

  getData(): any {
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
      settings
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
      const value = $(ev.currentTarget).val();
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
      
      // Apply ability score modifiers
      if (this.selectedTemplate.abilities) {
        this.formData.abilities = { ...this.selectedTemplate.abilities } as any;
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

      // Add classes if specified
      if (this.formData.classes && this.formData.classes.length > 0) {
        for (const cls of this.formData.classes) {
          await D35EAdapter.addClass(actor, cls.name, cls.level);
        }
      }

      // Roll HP if enabled
      if (autoRollHP) {
        await D35EAdapter.rollHP(actor);
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
