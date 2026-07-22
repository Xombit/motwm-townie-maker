import {
  CLERIC_SPELL_SLOTS,
  SORCERER_SPELL_SLOTS,
  WIZARD_SPELL_SLOTS,
} from "./spell-selection";

export const WealthTier = Object.freeze({
  UNEQUIPPED: "unequipped",
  NPC: "npc_wealth",
  PC: "pc_wealth",
} as const);

export const ClassTier = Object.freeze({
  PC: "pc_class",
  NPC: "npc_class",
  NONCOMBAT_NPC: "noncombat_npc_class",
} as const);

export type WealthTierValue = (typeof WealthTier)[keyof typeof WealthTier];
export type ClassTierValue = (typeof ClassTier)[keyof typeof ClassTier];

export interface CalculateCROptions {
  level: number;
  wealthTier: WealthTierValue;
  classTier: ClassTierValue;
  highestSpellLevel?: number;
  roundResult?: boolean;
}

const PC_CLASS_KEYS = new Set([
  "barbarian",
  "bard",
  "cleric",
  "druid",
  "fighter",
  "monk",
  "paladin",
  "ranger",
  "rogue",
  "sorcerer",
  "wizard",
]);

const NPC_CLASS_KEYS = new Set(["adept", "warrior"]);
const NONCOMBAT_NPC_CLASS_KEYS = new Set(["aristocrat", "commoner", "expert"]);

const PALADIN_SPELL_SLOTS: Record<number, number[]> = {
  1: [0, 0, 0, 0, 0],
  2: [0, 0, 0, 0, 0],
  3: [0, 0, 0, 0, 0],
  4: [0, 0, 0, 0, 0],
  5: [0, 0, 0, 0, 0],
  6: [0, 1, 0, 0, 0],
  7: [0, 1, 0, 0, 0],
  8: [0, 1, 0, 0, 0],
  9: [0, 1, 0, 0, 0],
  10: [0, 1, 1, 0, 0],
  11: [0, 1, 1, 0, 0],
  12: [0, 1, 1, 0, 0],
  13: [0, 1, 1, 0, 0],
  14: [0, 2, 1, 1, 0],
  15: [0, 2, 1, 1, 0],
  16: [0, 2, 2, 1, 0],
  17: [0, 2, 2, 1, 0],
  18: [0, 3, 2, 1, 1],
  19: [0, 3, 3, 2, 1],
  20: [0, 3, 3, 3, 2],
};

const RANGER_SPELL_SLOTS: Record<number, number[]> = {
  1: [0, 0, 0, 0, 0],
  2: [0, 0, 0, 0, 0],
  3: [0, 0, 0, 0, 0],
  4: [0, 0, 0, 0, 0],
  5: [0, 0, 0, 0, 0],
  6: [0, 1, 0, 0, 0],
  7: [0, 1, 0, 0, 0],
  8: [0, 1, 0, 0, 0],
  9: [0, 1, 0, 0, 0],
  10: [0, 1, 1, 0, 0],
  11: [0, 1, 1, 0, 0],
  12: [0, 1, 1, 1, 0],
  13: [0, 1, 1, 1, 0],
  14: [0, 2, 1, 1, 0],
  15: [0, 2, 1, 1, 1],
  16: [0, 2, 2, 1, 1],
  17: [0, 2, 2, 1, 1],
  18: [0, 3, 2, 1, 1],
  19: [0, 3, 3, 2, 1],
  20: [0, 3, 3, 3, 2],
};

export function normalizeClassKey(input: string | null | undefined): string {
  if (input === null || input === undefined) return "";

  let key = String(input);
  key = key.normalize("NFKC");
  key = key.trim();
  key = key.replace(/\s+/g, " ");
  key = key.replace(/\s*\((npc|npc class)\)$/i, "");
  key = key.replace(/([A-Za-z])\s*[:\-]\s*$/, "$1");
  key = key.toLowerCase();

  return key;
}

export function getWealthCRModifier(wealthTier: WealthTierValue): number {
  switch (wealthTier) {
    case WealthTier.PC:
      return 0;
    case WealthTier.NPC:
      return -1;
    case WealthTier.UNEQUIPPED:
      return -2;
    default:
      throw new Error(`Unknown wealth tier: ${wealthTier}`);
  }
}

export function getClassCRModifier(classTier: ClassTierValue): number {
  switch (classTier) {
    case ClassTier.PC:
      return 0;
    case ClassTier.NPC:
      return -1;
    case ClassTier.NONCOMBAT_NPC:
      return -2;
    default:
      throw new Error(`Unknown class tier: ${classTier}`);
  }
}

export function getCasterCRModifier(highestSpellLevel: number): number {
  if (!Number.isFinite(highestSpellLevel) || highestSpellLevel < 0) {
    throw new Error(`Invalid highest spell level: ${highestSpellLevel}`);
  }

  if (highestSpellLevel <= 3) return 0;
  if (highestSpellLevel <= 5) return 1;
  if (highestSpellLevel <= 7) return 2;
  return 3;
}

export function clampCR(cr: number): number {
  return Math.max(0.5, cr);
}

export function roundCR(cr: number): number {
  return Math.round(cr * 2) / 2;
}

export function formatCR(cr: number): string {
  return Number.isInteger(cr) ? String(cr) : cr.toFixed(1);
}

export function resolveClassTier(className: string, strict = false): ClassTierValue {
  const key = normalizeClassKey(className);

  if (PC_CLASS_KEYS.has(key)) return ClassTier.PC;
  if (NPC_CLASS_KEYS.has(key)) return ClassTier.NPC;
  if (NONCOMBAT_NPC_CLASS_KEYS.has(key)) return ClassTier.NONCOMBAT_NPC;

  if (key.includes("prestige")) return ClassTier.PC;

  if (strict) {
    console.warn(`CR | Unknown class '${className}', strict mode fallback to npc_class`);
    return ClassTier.NPC;
  }

  return ClassTier.PC;
}

function highestSpellLevelFromSlots(slots: number[]): number {
  for (let i = slots.length - 1; i >= 1; i--) {
    if ((slots[i] || 0) > 0) return i;
  }
  return 0;
}

export function getHighestSpellLevelAvailable(className: string, level: number): number {
  const key = normalizeClassKey(className);
  if (!Number.isFinite(level) || level < 1) return 0;

  const clampedLevel = Math.max(1, Math.min(20, Math.floor(level)));

  if (key === "wizard") return highestSpellLevelFromSlots(WIZARD_SPELL_SLOTS[clampedLevel] || []);
  if (key === "sorcerer" || key === "bard") return highestSpellLevelFromSlots(SORCERER_SPELL_SLOTS[clampedLevel] || []);
  if (key === "cleric" || key === "druid" || key === "adept") return highestSpellLevelFromSlots(CLERIC_SPELL_SLOTS[clampedLevel] || []);
  if (key === "paladin") return highestSpellLevelFromSlots(PALADIN_SPELL_SLOTS[clampedLevel] || []);
  if (key === "ranger") return highestSpellLevelFromSlots(RANGER_SPELL_SLOTS[clampedLevel] || []);

  return 0;
}

export function calculateGeneratedCharacterCR({
  level,
  wealthTier,
  classTier,
  highestSpellLevel = 0,
  roundResult = true,
}: CalculateCROptions): number {
  if (!Number.isFinite(level) || level <= 0) {
    throw new Error(`Invalid level: ${level}`);
  }

  let cr = level;
  cr += getWealthCRModifier(wealthTier);
  cr += getClassCRModifier(classTier);
  cr += getCasterCRModifier(highestSpellLevel);
  cr = clampCR(cr);

  return roundResult ? roundCR(cr) : cr;
}
