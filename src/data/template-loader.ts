import type { TownieTemplate } from "../types";

const MODULE_ID = "motwm-townie-maker";
const DEFAULT_TEMPLATES_JSON_PATH = "data/templates.json";

type TemplateLoadError = {
  message: string;
  details?: string;
  url: string;
};

type TemplateLoadResult = {
  templates: TownieTemplate[];
  error: TemplateLoadError | null;
};

let cached: TemplateLoadResult | null = null;
let inFlight: Promise<TemplateLoadResult> | null = null;

function getModuleBasePath(): string {
  // Foundry provides module metadata with a `path`.
  const mod: any = game.modules?.get(MODULE_ID);
  return mod?.path ?? `modules/${MODULE_ID}`;
}

function makeBlankTemplate(): TownieTemplate {
  return {
    id: "blank",
    name: "Blank Character",
    description: "Start from scratch with no presets",
    icon: "fas fa-user",
    abilities: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 }
  };
}

function normalizeTemplate(t: any): TownieTemplate {
  // Apply safe defaults expected by the UI.
  const useStandardBudget = t.useStandardBudget !== false;
  const usePcSheet = t.usePcSheet !== false;
  const useMaxHpPerHD = t.useMaxHpPerHD === true;

  return {
    ...t,
    useStandardBudget,
    usePcSheet,
    useMaxHpPerHD
  } as TownieTemplate;
}

function validateTemplates(raw: any): { templates: TownieTemplate[]; warnings: string[] } {
  if (!Array.isArray(raw)) {
    throw new Error("templates.json must be an array");
  }

  const warnings: string[] = [];
  const byId = new Map<string, TownieTemplate>();

  for (let i = 0; i < raw.length; i++) {
    const t = raw[i];
    if (!t || typeof t !== "object") {
      warnings.push(`Template at index ${i} is not an object; skipping`);
      continue;
    }

    if (typeof t.id !== "string" || t.id.trim() === "") {
      warnings.push(`Template at index ${i} is missing a valid id; skipping`);
      continue;
    }

    const requiredStringFields: Array<keyof TownieTemplate> = ["name", "description", "icon"]; // id handled above
    const missing = requiredStringFields.filter((k) => typeof (t as any)[k] !== "string" || ((t as any)[k] as any).trim?.() === "");
    if (missing.length > 0) {
      warnings.push(`Template '${t.id}' is missing required field(s): ${missing.join(", ")}; skipping`);
      continue;
    }

    byId.set(t.id, normalizeTemplate(t));
  }

  const templates = Array.from(byId.values());

  // Ensure a blank template always exists.
  if (!byId.has("blank")) {
    warnings.push("No 'blank' template found; adding a minimal blank template");
    templates.unshift(makeBlankTemplate());
  }

  return { templates, warnings };
}

export function clearTemplateCache(): void {
  cached = null;
  inFlight = null;
}

export async function loadTemplates(): Promise<TemplateLoadResult> {
  if (cached) return cached;
  if (inFlight) return inFlight;

  inFlight = (async (): Promise<TemplateLoadResult> => {
    const basePath = getModuleBasePath();
    const url = `${basePath}/${DEFAULT_TEMPLATES_JSON_PATH}`;

    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }

      const text = await res.text();
      const raw = JSON.parse(text);
      const { templates, warnings } = validateTemplates(raw);

      if (warnings.length > 0) {
        console.warn(`Townie Maker | Template load warnings from ${url}:\n- ${warnings.join("\n- ")}`);
      }

      return { templates, error: null };
    } catch (e: any) {
      const details = e?.stack || e?.message || String(e);
      const error: TemplateLoadError = {
        message: "Failed to load templates.json",
        details,
        url
      };

      console.error(`Townie Maker | ${error.message} (${url})`, e);

      return {
        templates: [makeBlankTemplate()],
        error
      };
    } finally {
      inFlight = null;
    }
  })();

  cached = await inFlight;
  return cached;
}
