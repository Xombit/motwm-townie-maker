// MOTWM Townie Maker - Main Entry Point
import { registerSettings } from "./settings";
import { TownieMakerApp } from "./ui/TownieMakerApp";
import { loadTemplates } from "./data/template-loader";
import "./styles/styles.css";

declare global {
  interface Window {
    MOTWM_TOWNIE?: {
      app?: TownieMakerApp;
      debugCompendiums?: () => Promise<void>;
      debugPack?: (packName: string) => Promise<void>;
    };
  }
}

Hooks.once("init", () => {
  console.log("motwm-townie-maker | Initializing");
  registerSettings();
  window.MOTWM_TOWNIE = window.MOTWM_TOWNIE ?? {};
});

Hooks.once("ready", () => {
  console.log("motwm-townie-maker | Ready");

  // Warm template loading early so JSON issues are visible even before opening the UI.
  loadTemplates().catch((e) => console.error("motwm-townie-maker | Failed to load templates on ready", e));
  
  if (!game.user?.isGM) {
    console.log("motwm-townie-maker | Non-GM user, limited features available");
  }

  // Register debug functions
  window.MOTWM_TOWNIE!.debugCompendiums = debugCompendiums;
  window.MOTWM_TOWNIE!.debugPack = debugPack;
  
  console.log("motwm-townie-maker | Debug commands available:");
  console.log("  MOTWM_TOWNIE.debugCompendiums() - List all compendium packs");
  console.log("  MOTWM_TOWNIE.debugPack('pack-name') - Inspect a specific pack");
});

// Add Townie Maker button to Actor Directory
Hooks.on("getActorDirectoryEntryContext", (html: JQuery, options: any[]) => {
  // Can add right-click context menu options here later
});

// Add toolbar button to Actor Directory
Hooks.on("renderActorDirectory", (app: any, html: JQuery, data: any) => {
  if (!game.user?.isGM) return;

  const button = $(`
    <button class="motwm-townie-maker-btn" title="Open Townie Maker">
      <i class="fas fa-user-plus"></i> Townie Maker
    </button>
  `);

  button.on("click", () => {
    if (!window.MOTWM_TOWNIE?.app) {
      window.MOTWM_TOWNIE!.app = new TownieMakerApp();
    }
    window.MOTWM_TOWNIE!.app.render(true);
  });

  html.find(".directory-header .action-buttons").append(button);
});

// Debug function to list all compendiums
async function debugCompendiums(): Promise<void> {
  console.log("=== COMPENDIUM PACKS ===");
  console.log(`Total packs: ${game.packs?.size || 0}`);
  console.log("");
  
  if (!game.packs) {
    console.log("No packs available!");
    return;
  }

  // Group by package
  const byPackage = new Map<string, any[]>();
  
  for (const pack of game.packs.values()) {
    const packageName = pack.metadata.packageName || "unknown";
    if (!byPackage.has(packageName)) {
      byPackage.set(packageName, []);
    }
    byPackage.get(packageName)!.push(pack);
  }

  // Display grouped
  for (const [packageName, packs] of byPackage.entries()) {
    console.log(`📦 ${packageName.toUpperCase()}`);
    for (const pack of packs) {
      const meta = pack.metadata;
      console.log(`  ${meta.id}`);
      console.log(`    Label: ${meta.label}`);
      console.log(`    Type: ${meta.type}`);
      console.log(`    System: ${meta.system || "any"}`);
      
      // Get index to see how many items
      try {
        const index = await pack.getIndex();
        console.log(`    Items: ${index.size}`);
      } catch (e) {
        console.log(`    Items: Error loading index`);
      }
    }
    console.log("");
  }

  console.log("💡 Use MOTWM_TOWNIE.debugPack('pack-id') to inspect a specific pack");
}

// Debug function to inspect a specific pack
async function debugPack(packName: string): Promise<void> {
  const pack = game.packs?.get(packName);
  
  if (!pack) {
    console.error(`Pack '${packName}' not found!`);
    console.log("Available packs:");
    game.packs?.forEach(p => console.log(`  - ${p.metadata.id}`));
    return;
  }

  console.log(`=== ${pack.metadata.label} (${packName}) ===`);
  console.log(`Type: ${pack.metadata.type}`);
  console.log(`System: ${pack.metadata.system || "any"}`);
  console.log("");

  try {
    // Get the index first (lightweight)
    const index = await pack.getIndex();
    console.log(`📑 Index (${index.size} items):`);
    
    // Group by type if available
    const byType = new Map<string, any[]>();
    for (const entry of index.values()) {
      const type = (entry as any).type || "unknown";
      if (!byType.has(type)) {
        byType.set(type, []);
      }
      byType.get(type)!.push(entry);
    }

    // Display grouped
    for (const [type, items] of byType.entries()) {
      console.log(`  ${type} (${items.length}):`);
      items.slice(0, 10).forEach((item: any) => {
        console.log(`    - ${item.name} [${item._id}]`);
      });
      if (items.length > 10) {
        console.log(`    ... and ${items.length - 10} more`);
      }
    }

    // Get a sample document to inspect structure
    if (index.size > 0) {
      console.log("");
      console.log("📄 Sample document structure:");
      const firstId = index.contents[0]._id;
      const doc = await pack.getDocument(firstId);
      console.log("Document keys:", Object.keys(doc || {}));
      console.log("System data keys:", Object.keys((doc as any)?.system || {}));
      console.log("Full sample:", doc);
    }

  } catch (error) {
    console.error("Error loading pack:", error);
  }
}
