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
    
    // Try to get from compendiums
    const classPacks = game.packs?.filter(p => 
      p.metadata.type === "Item" && 
      p.metadata.label?.toLowerCase().includes("class")
    );
    
    if (classPacks) {
      for (const pack of classPacks) {
        const content = await pack.getDocuments();
        for (const item of content) {
          if ((item as any).type === "class") {
            classes.push({ id: item.id!, name: item.name! });
          }
        }
      }
    }
    
    return classes;
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
   * Add a class to an actor
   */
  static async addClass(actor: Actor, className: string, level: number): Promise<void> {
    // This will need to be implemented based on how D35E handles class addition
    // For now, just a placeholder
    console.log(`Adding class ${className} level ${level} to ${actor.name}`);
  }

  /**
   * Roll HP for an actor
   */
  static async rollHP(actor: Actor): Promise<void> {
    // This will need to be implemented based on D35E system
    console.log(`Rolling HP for ${actor.name}`);
  }
}
