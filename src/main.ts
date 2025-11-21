// MOTWM Townie Maker - Main Entry Point
import { registerSettings } from "./settings";
import { TownieMakerApp } from "./ui/TownieMakerApp";
import "./styles/styles.css";

declare global {
  interface Window {
    MOTWM_TOWNIE?: {
      app?: TownieMakerApp;
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
  
  if (!game.user?.isGM) {
    console.log("motwm-townie-maker | Non-GM user, limited features available");
  }
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
