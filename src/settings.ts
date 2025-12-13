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
      standard: "Standard Array (15,14,13,12,10,8)",
      elite: "Elite Array (15,14,13,12,10,8)",
      custom: "Custom/Manual Entry",
      roll: "Roll 4d6 drop lowest"
    },
    default: "standard"
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
