// Settings registration for Townie Maker
export function registerSettings(): void {
  // Default NPC type (character vs npc sheet type)
  game.settings.register("motwm-townie-maker", "defaultActorType", {
    name: "Default Actor Type",
    hint: "What type of actor sheet to create by default (character uses PC sheet, npc uses NPC sheet)",
    scope: "world",
    config: true,
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
