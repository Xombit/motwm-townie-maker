// Settings registration for Townie Maker
export function registerSettings(): void {
  // Default sheet type (PC sheet vs Simple NPC sheet)
  game.settings.register("motwm-townie-maker", "defaultSheetType", {
    name: "Default Sheet Type",
    hint: "PC Sheet has full leveling/HP tracking. Simple NPC Sheet has manual HP and is lighter weight.",
    scope: "world",
    config: true,
    type: String,
    choices: {
      pc: "PC Sheet (Full Features)",
      npc: "Simple NPC Sheet (Manual HP)"
    },
    default: "pc"
  });

  // Default NPC type (character vs npc sheet type) - DEPRECATED, use defaultSheetType instead
  game.settings.register("motwm-townie-maker", "defaultActorType", {
    name: "Default Actor Type (Deprecated)",
    hint: "Use 'Default Sheet Type' instead. This setting is kept for backwards compatibility.",
    scope: "world",
    config: false,  // Hide from settings UI
    type: String,
    choices: {
      character: "Character (PC Sheet)",
      npc: "NPC (NPC Sheet)"
    },
    default: "character"
  });

  // Auto-roll HP on creation
  game.settings.register("motwm-townie-maker", "autoRollHP", {
    name: "Auto-Roll HP",
    hint: "Automatically roll HP when creating NPCs",
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  // Default ability score method
  game.settings.register("motwm-townie-maker", "abilityScoreMethod", {
    name: "Ability Score Method",
    hint: "Default method for generating ability scores",
    scope: "world",
    config: true,
    type: String,
    choices: {
      manual: "Manual Entry",
      standardArray: "Standard Array (15,14,13,12,10,8)",
      pointBuy: "Auto Buy",
      roll3d6: "Roll 3d6",
      roll4d6DropLowest: "Roll 4d6, drop lowest"
    },
    default: "standardArray"
  });

  game.settings.register("motwm-townie-maker", "defaultPointBuyBudget", {
    name: "Default Auto Buy Budget",
    hint: "Default D&D 3.5 point budget used by Townie Maker's simplified automatic allocator.",
    scope: "world",
    config: true,
    type: Number,
    choices: {
      15: "15 points (ordinary)",
      22: "22 points (challenging)",
      25: "25 points (heroic)",
      28: "28 points (tougher)",
      32: "32 points (high-powered)"
    },
    default: 15
  });

  // Save created NPCs to folder
  game.settings.register("motwm-townie-maker", "defaultFolder", {
    name: "Default Folder",
    hint: "Folder name to save created NPCs (leave blank for root)",
    scope: "world",
    config: true,
    type: String,
    default: "Townies"
  });
}
