import { getPrimaryClassToken, isPartialCasterClass, isPureArcaneClass } from './class-utils';
import type { BudgetMode } from '../ui/budget-mode';

export const BASIS_POINTS_TOTAL = 10_000;

export const SPENDING_CATEGORIES = [
  'weapon',
  'armor',
  'abilityItem',
  'resistance',
  'protection',
  'consumables',
  'rodsStaves',
  'mightyFists',
] as const;

export type SpendingCategory = typeof SPENDING_CATEGORIES[number];

export type SpendingPresetId =
  | 'classRecommended'
  | 'frontlineOffense'
  | 'defensive'
  | 'spellcaster'
  | 'support';

export type BudgetProfileId =
  | 'martial'
  | 'caster'
  | 'pureCaster'
  | 'partialCasterMartial'
  | 'monk'
  | 'clericMelee'
  | 'clericCaster'
  | 'druidWildshape'
  | 'druidCaster';

export interface SpendingCategoryRule {
  enabled: boolean;
  shareBasisPoints: number;
  maxShareBasisPoints: number;
  priority: number;
  itemLimit?: number;
}

export interface SpendingPlanConfig {
  version: 1;
  preset: SpendingPresetId;
  wealth: {
    mode: BudgetMode;
    multiplierPercent: number;
    reservePercent: number;
  };
  categories?: Partial<Record<SpendingCategory, Partial<SpendingCategoryRule>>>;
  splits?: {
    primaryWeaponBasisPoints?: number;
    secondaryWeaponBasisPoints?: number;
    armorBasisPoints?: number;
    shieldBasisPoints?: number;
    ringBasisPoints?: number;
    otherProtectionBasisPoints?: number;
    wandsBasisPoints?: number;
    scrollsBasisPoints?: number;
    potionsBasisPoints?: number;
  };
}

export type SpendingSplitKey = keyof NonNullable<SpendingPlanConfig['splits']>;

export const SPENDING_SPLIT_GROUPS = {
  weapon: ['primaryWeaponBasisPoints', 'secondaryWeaponBasisPoints'],
  armor: ['armorBasisPoints', 'shieldBasisPoints'],
  protection: ['ringBasisPoints', 'otherProtectionBasisPoints'],
  consumables: ['wandsBasisPoints', 'scrollsBasisPoints', 'potionsBasisPoints'],
} as const satisfies Record<string, readonly SpendingSplitKey[]>;

export type SpendingSplitGroupKey = keyof typeof SPENDING_SPLIT_GROUPS;

export interface SplitGroupEditResult {
  values: Record<SpendingSplitKey, number>;
  acceptedBasisPoints: number;
  maximumBasisPoints: number;
  clamped: boolean;
}

export interface LegacyMagicItemBudgets {
  shieldPercent?: number;
  armorPercent?: number;
  secondaryWeaponPercent?: number;
  ringPercent?: number;
  amuletPercent?: number;
}

export interface ResolveSpendingPlanInput {
  level: number;
  className: string;
  hasShield: boolean;
  totalWealthGp: number;
  mundaneCostGp: number;
  config?: Partial<SpendingPlanConfig>;
  legacyMagicItemBudgets?: LegacyMagicItemBudgets;
  legacyBudgetMode?: BudgetMode;
  legacyReservePercent?: number;
}

export interface ResolvedSpendingCategory extends SpendingCategoryRule {
  key: SpendingCategory;
  applicable: boolean;
  allocatedGp: number;
}

export interface ResolvedSpendingPlan {
  version: 1;
  preset: SpendingPresetId;
  profile: BudgetProfileId;
  wealth: SpendingPlanConfig['wealth'];
  totalWealthGp: number;
  mundaneCostGp: number;
  grossMagicBudgetGp: number;
  reservedGp: number;
  spendableGp: number;
  categories: Record<SpendingCategory, ResolvedSpendingCategory>;
  priority: SpendingCategory[];
  splits: Required<NonNullable<SpendingPlanConfig['splits']>>;
  warnings: string[];
}

export interface SpendingStageReport {
  category: SpendingCategory;
  baseGp: number;
  rolloverReceivedGp: number;
  availableGp: number;
  spentGp: number;
  rolloverSentGp: number;
  selectedItems?: Array<{ name: string; cost: number }>;
  warnings?: string[];
}

export interface SpendingReport {
  spendableGp: number;
  totalSpentGp: number;
  finalCashGp: number;
  stages: SpendingStageReport[];
  warnings: string[];
}

export interface SpendingStageSelection<T = unknown> {
  value: T;
  spentGp: number;
  selectedItems?: Array<{ name: string; cost: number }>;
  warnings?: string[];
}

export type SpendingStageSelectors = Partial<{
  [Category in SpendingCategory]: (
    availableGp: number,
    rule: ResolvedSpendingCategory,
  ) => SpendingStageSelection | Promise<SpendingStageSelection>;
}>;

export interface ExecutedSpendingPlan {
  report: SpendingReport;
  selections: Partial<Record<SpendingCategory, unknown>>;
}

type CategoryShares = Record<SpendingCategory, number>;

const PROFILE_SHARES: Record<BudgetProfileId, CategoryShares> = {
  martial: shares(3800, 3400, 1200, 700, 700, 200, 0, 0),
  caster: shares(2200, 2200, 1800, 1200, 1000, 1600, 0, 0),
  pureCaster: shares(500, 0, 2200, 1400, 1800, 1200, 2900, 0),
  partialCasterMartial: shares(3800, 3400, 1200, 600, 400, 600, 0, 0),
  monk: shares(0, 0, 2500, 800, 2500, 1200, 0, 3000),
  clericMelee: shares(3000, 3200, 1500, 800, 700, 800, 0, 0),
  clericCaster: shares(500, 2500, 1800, 1200, 1000, 1200, 1800, 0),
  druidWildshape: shares(0, 2000, 1800, 1000, 1200, 1200, 0, 2800),
  druidCaster: shares(500, 2000, 2000, 1200, 1000, 1400, 1900, 0),
};

const PRESET_SHARES: Exclude<Record<SpendingPresetId, CategoryShares>, { classRecommended: CategoryShares }> = {
  frontlineOffense: shares(5000, 2500, 1000, 500, 500, 500, 0, 0),
  defensive: shares(1800, 3500, 1200, 1400, 1600, 500, 0, 0),
  spellcaster: shares(0, 1000, 2500, 1000, 1000, 1500, 3000, 0),
  support: shares(1000, 1500, 1500, 1200, 1300, 3500, 0, 0),
};

const DEFAULT_PRIORITY = [...SPENDING_CATEGORIES];

function shares(
  weapon: number,
  armor: number,
  abilityItem: number,
  resistance: number,
  protection: number,
  consumables: number,
  rodsStaves: number,
  mightyFists: number,
): CategoryShares {
  return { weapon, armor, abilityItem, resistance, protection, consumables, rodsStaves, mightyFists };
}

function clampInteger(value: number | undefined, minimum: number, maximum: number, fallback: number): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(maximum, Math.max(minimum, Math.round(Number(value))));
}

function decimalToBasisPoints(value: number | undefined, fallback: number): number {
  if (!Number.isFinite(value)) return fallback;
  return clampInteger(Number(value) * BASIS_POINTS_TOTAL, 0, BASIS_POINTS_TOTAL, fallback);
}

export function detectBudgetProfile(className: string, hasShield: boolean): BudgetProfileId {
  const classToken = getPrimaryClassToken(className);

  if (classToken === 'monk') return 'monk';
  if (isPureArcaneClass(className)) return 'pureCaster';
  if (classToken === 'cleric' || classToken === 'adept') return hasShield ? 'clericMelee' : 'clericCaster';
  if (classToken === 'druid') return hasShield ? 'druidWildshape' : 'druidCaster';
  if (classToken === 'paladin' || classToken === 'ranger') return 'partialCasterMartial';
  if (classToken === 'bard' || isPartialCasterClass(className)) return 'caster';
  return 'martial';
}

function getRecommendedShares(profile: BudgetProfileId, level: number): CategoryShares {
  const result = { ...PROFILE_SHARES[profile] };

  if (profile === 'martial' && level >= 3 && level <= 7) {
    return shares(4500, 3200, 900, 700, 700, 0, 0, 0);
  }
  if (profile === 'martial' && level >= 8 && level <= 10) {
    return shares(4000, 3300, 1100, 700, 700, 200, 0, 0);
  }

  return result;
}

function isCategoryApplicable(category: SpendingCategory, profile: BudgetProfileId): boolean {
  if (category === 'weapon') return !['monk', 'druidWildshape'].includes(profile);
  if (category === 'armor') return profile !== 'pureCaster' && profile !== 'monk';
  if (category === 'rodsStaves') return ['pureCaster', 'clericCaster', 'druidCaster'].includes(profile);
  if (category === 'mightyFists') return profile === 'monk' || profile === 'druidWildshape';
  return true;
}

function getPresetShares(preset: SpendingPresetId, profile: BudgetProfileId, level: number): CategoryShares {
  if (preset === 'classRecommended') return getRecommendedShares(profile, level);
  if (preset !== 'spellcaster') return { ...PRESET_SHARES[preset] };

  if (profile === 'pureCaster') {
    return shares(500, 0, 2200, 1400, 1800, 1200, 2900, 0);
  }
  if (profile === 'clericCaster' || profile === 'druidCaster') {
    return shares(500, 2000, 2000, 1000, 1000, 1500, 2000, 0);
  }
  if (profile === 'caster') {
    return shares(1500, 1500, 2500, 1000, 1000, 2500, 0, 0);
  }
  if (profile === 'partialCasterMartial' || profile === 'clericMelee') {
    return shares(1500, 2000, 2000, 1000, 1000, 2500, 0, 0);
  }
  if (profile === 'monk') {
    return shares(0, 0, 2500, 1000, 2000, 2000, 0, 2500);
  }
  if (profile === 'druidWildshape') {
    return shares(0, 1500, 2000, 1000, 1500, 1500, 0, 2500);
  }
  if (profile === 'martial') {
    return shares(2000, 2000, 2000, 1000, 1000, 2000, 0, 0);
  }

  return { ...PRESET_SHARES.spellcaster };
}

export function normalizeBasisPointShares(
  rawShares: Partial<Record<SpendingCategory, number>>,
  enabledCategories: readonly SpendingCategory[],
): CategoryShares {
  const enabled = new Set(enabledCategories);
  const sanitized = Object.fromEntries(SPENDING_CATEGORIES.map(category => [
    category,
    enabled.has(category) ? Math.max(0, Math.round(rawShares[category] ?? 0)) : 0,
  ])) as CategoryShares;
  const total = Object.values(sanitized).reduce((sum, value) => sum + value, 0);

  if (enabledCategories.length === 0) return sanitized;
  if (total === 0) {
    const equalShares = Object.fromEntries(SPENDING_CATEGORIES.map(category => [category, 0])) as CategoryShares;
    const quotient = Math.floor(BASIS_POINTS_TOTAL / enabledCategories.length);
    let remainder = BASIS_POINTS_TOTAL - quotient * enabledCategories.length;
    for (const category of enabledCategories) {
      equalShares[category] = quotient + (remainder > 0 ? 1 : 0);
      remainder--;
    }
    return equalShares;
  }

  const exact = enabledCategories.map((category, index) => {
    const numerator = sanitized[category] * BASIS_POINTS_TOTAL;
    return {
      category,
      index,
      value: Math.floor(numerator / total),
      remainder: numerator % total,
    };
  });
  let remaining = BASIS_POINTS_TOTAL - exact.reduce((sum, entry) => sum + entry.value, 0);
  exact.sort((left, right) => right.remainder - left.remainder || left.index - right.index);
  for (let index = 0; index < remaining; index++) exact[index].value++;

  const normalized = Object.fromEntries(SPENDING_CATEGORIES.map(category => [category, 0])) as CategoryShares;
  for (const entry of exact) normalized[entry.category] = entry.value;
  return normalized;
}

function normalizeSplitGroup(
  values: Partial<Record<SpendingSplitKey, number>>,
  keys: readonly SpendingSplitKey[],
  defaults: Readonly<Record<SpendingSplitKey, number>>,
  label: string,
  warnings: string[],
): Record<SpendingSplitKey, number> {
  const supplied = keys.filter(key => Number.isFinite(values[key]));
  if (supplied.length === 0) {
    return Object.fromEntries(keys.map(key => [key, defaults[key]])) as Record<SpendingSplitKey, number>;
  }

  const result = Object.fromEntries(keys.map(key => [
    key,
    supplied.includes(key) ? clampInteger(values[key], 0, BASIS_POINTS_TOTAL, 0) : 0,
  ])) as Record<SpendingSplitKey, number>;
  const suppliedTotal = supplied.reduce((sum, key) => sum + result[key], 0);
  const missing = keys.filter(key => !supplied.includes(key));

  if (missing.length > 0 && suppliedTotal <= BASIS_POINTS_TOTAL) {
    const remainder = BASIS_POINTS_TOTAL - suppliedTotal;
    const defaultWeight = missing.reduce((sum, key) => sum + defaults[key], 0);
    let assigned = 0;
    missing.forEach((key, index) => {
      const value = index === missing.length - 1
        ? remainder - assigned
        : Math.floor(remainder * (defaultWeight > 0 ? defaults[key] / defaultWeight : 1 / missing.length));
      result[key] = value;
      assigned += value;
    });
    return result;
  }

  const total = keys.reduce((sum, key) => sum + result[key], 0);
  if (total === BASIS_POINTS_TOTAL) return result;
  if (total === 0) {
    warnings.push(`${label} totaled 0%; defaults were restored.`);
    return Object.fromEntries(keys.map(key => [key, defaults[key]])) as Record<SpendingSplitKey, number>;
  }

  warnings.push(`${label} totaled ${total / 100}%; it was normalized to 100%.`);
  const ranked = keys.map((key, index) => {
    const numerator = result[key] * BASIS_POINTS_TOTAL;
    return { key, index, value: Math.floor(numerator / total), remainder: numerator % total };
  });
  let remaining = BASIS_POINTS_TOTAL - ranked.reduce((sum, entry) => sum + entry.value, 0);
  ranked.sort((left, right) => right.remainder - left.remainder || left.index - right.index);
  for (let index = 0; index < remaining; index++) ranked[index].value++;
  return Object.fromEntries(ranked.map(entry => [entry.key, entry.value])) as Record<SpendingSplitKey, number>;
}

export function clampSplitGroupEdit(
  current: Record<SpendingSplitKey, number>,
  group: SpendingSplitGroupKey,
  editedKey: SpendingSplitKey,
  requestedBasisPoints: number,
): SplitGroupEditResult {
  const keys = SPENDING_SPLIT_GROUPS[group] as readonly SpendingSplitKey[];
  if (!keys.includes(editedKey)) {
    throw new Error(`${editedKey} is not a member of the ${group} split group.`);
  }
  const otherTotal = keys
    .filter(key => key !== editedKey)
    .reduce((sum, key) => sum + clampInteger(current[key], 0, BASIS_POINTS_TOTAL, 0), 0);
  const maximumBasisPoints = Math.max(0, BASIS_POINTS_TOTAL - otherTotal);
  const requested = clampInteger(requestedBasisPoints, 0, BASIS_POINTS_TOTAL, 0);
  const acceptedBasisPoints = Math.min(requested, maximumBasisPoints);
  return {
    values: { ...current, [editedKey]: acceptedBasisPoints },
    acceptedBasisPoints,
    maximumBasisPoints,
    clamped: acceptedBasisPoints !== requested,
  };
}

export function allocateGpByBasisPoints(totalGp: number, categoryShares: CategoryShares): Record<SpendingCategory, number> {
  const safeTotal = Math.max(0, Math.floor(totalGp));
  const allocations = Object.fromEntries(SPENDING_CATEGORIES.map(category => [category, 0])) as Record<SpendingCategory, number>;
  const exact = SPENDING_CATEGORIES.map((category, index) => {
    const numerator = safeTotal * categoryShares[category];
    return {
      category,
      index,
      value: Math.floor(numerator / BASIS_POINTS_TOTAL),
      remainder: numerator % BASIS_POINTS_TOTAL,
    };
  });
  let remaining = safeTotal - exact.reduce((sum, entry) => sum + entry.value, 0);
  exact.sort((left, right) => right.remainder - left.remainder || left.index - right.index);
  for (let index = 0; index < remaining; index++) exact[index].value++;
  for (const entry of exact) allocations[entry.category] = entry.value;
  return allocations;
}

function resolveLegacySplits(
  legacy: LegacyMagicItemBudgets | undefined,
  warnings: string[],
): Required<NonNullable<SpendingPlanConfig['splits']>> {
  const normalizePair = (
    first: number | undefined,
    second: number | undefined,
    fallback: number,
    label: string,
  ): number => {
    if (first === undefined && second === undefined) return fallback;
    const firstBp = decimalToBasisPoints(first, fallback);
    const secondBp = decimalToBasisPoints(second, BASIS_POINTS_TOTAL - firstBp);
    const total = firstBp + secondBp;
    if (total === BASIS_POINTS_TOTAL) return firstBp;
    warnings.push(`${label} legacy split totaled ${total / 100}%; it was normalized to 100%.`);
    if (total === 0) return fallback;
    return Math.round(firstBp * BASIS_POINTS_TOTAL / total);
  };

  const secondaryWeaponBasisPoints = decimalToBasisPoints(legacy?.secondaryWeaponPercent, 5000);
  const shieldBasisPoints = normalizePair(legacy?.shieldPercent, legacy?.armorPercent, 4000, 'Armor/shield');
  const ringBasisPoints = normalizePair(legacy?.ringPercent, legacy?.amuletPercent, 6000, 'Ring/amulet');
  return {
    primaryWeaponBasisPoints: BASIS_POINTS_TOTAL - secondaryWeaponBasisPoints,
    secondaryWeaponBasisPoints,
    armorBasisPoints: BASIS_POINTS_TOTAL - shieldBasisPoints,
    shieldBasisPoints,
    ringBasisPoints,
    otherProtectionBasisPoints: BASIS_POINTS_TOTAL - ringBasisPoints,
    wandsBasisPoints: 6000,
    scrollsBasisPoints: 2500,
    potionsBasisPoints: 1500,
  };
}

export function resolveSpendingPlan(input: ResolveSpendingPlanInput): ResolvedSpendingPlan {
  const warnings: string[] = [];
  const profile = detectBudgetProfile(input.className, input.hasShield);
  const preset = input.config?.preset ?? 'classRecommended';
  const mode = input.config?.wealth?.mode ?? input.legacyBudgetMode ?? 'standardBudget';
  const multiplierPercent = clampInteger(input.config?.wealth?.multiplierPercent, 0, 200, 100);
  const reservePercent = clampInteger(
    input.config?.wealth?.reservePercent ?? input.legacyReservePercent,
    0,
    100,
    0,
  );

  const applicableCategories = SPENDING_CATEGORIES.filter(category => isCategoryApplicable(category, profile));
  const presetShares = getPresetShares(preset, profile, input.level);
  const configuredShares = Object.fromEntries(SPENDING_CATEGORIES.map(category => [
    category,
    input.config?.categories?.[category]?.shareBasisPoints ?? presetShares[category],
  ])) as CategoryShares;
  const enabledCategories = applicableCategories.filter(category => input.config?.categories?.[category]?.enabled !== false);
  const sharesByCategory = normalizeBasisPointShares(configuredShares, enabledCategories);

  const rawWealth = mode === 'noBudget' ? 0 : Math.max(0, Math.floor(input.totalWealthGp));
  const adjustedWealth = Math.floor(rawWealth * multiplierPercent / 100);
  const mundaneCostGp = Math.min(adjustedWealth, Math.max(0, Math.floor(input.mundaneCostGp)));
  const grossMagicBudgetGp = Math.max(0, adjustedWealth - mundaneCostGp);
  const reservedGp = Math.floor(grossMagicBudgetGp * reservePercent / 100);
  const spendableGp = grossMagicBudgetGp - reservedGp;
  const gpByCategory = allocateGpByBasisPoints(spendableGp, sharesByCategory);

  const categories = Object.fromEntries(SPENDING_CATEGORIES.map((category, index) => {
    const configuredRule = input.config?.categories?.[category];
    const enabled = enabledCategories.includes(category);
    const shareBasisPoints = sharesByCategory[category];
    const maxShareBasisPoints = enabled
      ? Math.max(shareBasisPoints, clampInteger(configuredRule?.maxShareBasisPoints, 0, BASIS_POINTS_TOTAL, BASIS_POINTS_TOTAL))
      : 0;
    return [category, {
      key: category,
      applicable: applicableCategories.includes(category),
      enabled,
      shareBasisPoints,
      maxShareBasisPoints,
      priority: clampInteger(configuredRule?.priority, 0, 100, index),
      itemLimit: configuredRule?.itemLimit === undefined
        ? undefined
        : clampInteger(configuredRule.itemLimit, 0, 100, 0),
      allocatedGp: gpByCategory[category],
    }];
  })) as Record<SpendingCategory, ResolvedSpendingCategory>;
  const priority = enabledCategories
    .slice()
    .sort((left, right) => categories[left].priority - categories[right].priority
      || DEFAULT_PRIORITY.indexOf(left) - DEFAULT_PRIORITY.indexOf(right));

  const configuredSplits = input.config?.splits;
  const legacySplits = resolveLegacySplits(input.legacyMagicItemBudgets, warnings);
  const configured = (configuredSplits ?? {}) as Partial<Record<SpendingSplitKey, number>>;
  const defaults = { ...legacySplits } as Record<SpendingSplitKey, number>;
  const casterFocused = profile === 'pureCaster' || profile === 'clericCaster' || profile === 'druidCaster';
  const hasConfiguredWeaponMix = configured.primaryWeaponBasisPoints !== undefined
    || configured.secondaryWeaponBasisPoints !== undefined
    || input.legacyMagicItemBudgets?.secondaryWeaponPercent !== undefined;
  if (casterFocused && !hasConfiguredWeaponMix) {
    defaults.primaryWeaponBasisPoints = BASIS_POINTS_TOTAL;
    defaults.secondaryWeaponBasisPoints = 0;
  }
  const hasConfiguredConsumables = configured.wandsBasisPoints !== undefined
    || configured.scrollsBasisPoints !== undefined
    || configured.potionsBasisPoints !== undefined;
  if (!hasConfiguredConsumables) {
    if (profile === 'martial' || profile === 'monk' || profile === 'druidWildshape') {
      defaults.wandsBasisPoints = 0;
      defaults.scrollsBasisPoints = 0;
      defaults.potionsBasisPoints = BASIS_POINTS_TOTAL;
    } else if (profile === 'partialCasterMartial' || profile === 'caster') {
      defaults.wandsBasisPoints = 4000;
      defaults.scrollsBasisPoints = 1500;
      defaults.potionsBasisPoints = 4500;
    }
  }
  const splits = {
    ...normalizeSplitGroup(configured, SPENDING_SPLIT_GROUPS.weapon, defaults, 'Weapon mix', warnings),
    ...normalizeSplitGroup(configured, SPENDING_SPLIT_GROUPS.armor, defaults, 'Armor mix', warnings),
    ...normalizeSplitGroup(configured, SPENDING_SPLIT_GROUPS.protection, defaults, 'Protection mix', warnings),
    ...normalizeSplitGroup(configured, SPENDING_SPLIT_GROUPS.consumables, defaults, 'Consumables mix', warnings),
  } as Required<NonNullable<SpendingPlanConfig['splits']>>;

  return {
    version: 1,
    preset,
    profile,
    wealth: { mode, multiplierPercent, reservePercent },
    totalWealthGp: adjustedWealth,
    mundaneCostGp,
    grossMagicBudgetGp,
    reservedGp,
    spendableGp,
    categories,
    priority,
    splits,
    warnings,
  };
}

export function createDefaultSpendingPlanConfig(mode: BudgetMode = 'standardBudget'): SpendingPlanConfig {
  return {
    version: 1,
    preset: 'classRecommended',
    wealth: {
      mode,
      multiplierPercent: 100,
      reservePercent: 0,
    },
  };
}

export function resolveSpendingReport(
  plan: ResolvedSpendingPlan,
  requestedSpend: Partial<Record<SpendingCategory, number>>,
): SpendingReport {
  const stages: SpendingStageReport[] = [];
  const warnings: string[] = [];
  let rolloverGp = 0;
  let totalSpentGp = 0;

  for (const category of plan.priority) {
    const rule = plan.categories[category];
    const baseGp = rule.allocatedGp;
    const capGp = Math.max(baseGp, Math.floor(plan.spendableGp * rule.maxShareBasisPoints / BASIS_POINTS_TOTAL));
    const acceptedRolloverGp = Math.min(rolloverGp, Math.max(0, capGp - baseGp));
    const bypassedRolloverGp = rolloverGp - acceptedRolloverGp;
    const availableGp = baseGp + acceptedRolloverGp;
    const requestedGp = Math.max(0, Math.floor(requestedSpend[category] ?? 0));
    const spentGp = Math.min(requestedGp, availableGp);

    if (requestedGp > availableGp) {
      warnings.push(`${category} requested ${requestedGp} gp but was limited to ${availableGp} gp.`);
    }

    rolloverGp = bypassedRolloverGp + availableGp - spentGp;
    totalSpentGp += spentGp;
    stages.push({
      category,
      baseGp,
      rolloverReceivedGp: acceptedRolloverGp,
      availableGp,
      spentGp,
      rolloverSentGp: rolloverGp,
    });
  }

  return {
    spendableGp: plan.spendableGp,
    totalSpentGp,
    finalCashGp: rolloverGp,
    stages,
    warnings,
  };
}

export async function executeSpendingPlan(
  plan: ResolvedSpendingPlan,
  selectors: SpendingStageSelectors,
): Promise<ExecutedSpendingPlan> {
  const stages: SpendingStageReport[] = [];
  const warnings: string[] = [];
  const selections: Partial<Record<SpendingCategory, unknown>> = {};
  let rolloverGp = 0;
  let totalSpentGp = 0;

  for (const category of plan.priority) {
    const rule = plan.categories[category];
    const baseGp = rule.allocatedGp;
    const capGp = Math.max(baseGp, Math.floor(plan.spendableGp * rule.maxShareBasisPoints / BASIS_POINTS_TOTAL));
    const rolloverReceivedGp = Math.min(rolloverGp, Math.max(0, capGp - baseGp));
    const bypassedRolloverGp = rolloverGp - rolloverReceivedGp;
    const availableGp = baseGp + rolloverReceivedGp;
    const selector = selectors[category];
    const selection = selector
      ? await selector(availableGp, rule)
      : { value: undefined, spentGp: 0, warnings: [`No selector is registered for ${category}.`] };
    const spentGp = Math.max(0, Math.floor(selection.spentGp));

    if (spentGp > availableGp) {
      throw new Error(`${category} selector spent ${spentGp} gp from an available budget of ${availableGp} gp.`);
    }

    rolloverGp = bypassedRolloverGp + availableGp - spentGp;
    totalSpentGp += spentGp;
    selections[category] = selection.value;
    const stageWarnings = selection.warnings ?? [];
    warnings.push(...stageWarnings);
    stages.push({
      category,
      baseGp,
      rolloverReceivedGp,
      availableGp,
      spentGp,
      rolloverSentGp: rolloverGp,
      selectedItems: selection.selectedItems,
      warnings: stageWarnings,
    });
  }

  if (totalSpentGp + rolloverGp !== plan.spendableGp) {
    throw new Error(`Spending ledger imbalance: ${totalSpentGp} spent + ${rolloverGp} cash != ${plan.spendableGp} budget.`);
  }

  return {
    report: {
      spendableGp: plan.spendableGp,
      totalSpentGp,
      finalCashGp: rolloverGp,
      stages,
      warnings,
    },
    selections,
  };
}