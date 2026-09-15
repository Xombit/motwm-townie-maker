export const ABILITY_KEYS = ['str', 'dex', 'con', 'int', 'wis', 'cha'] as const;

export type AbilityKey = typeof ABILITY_KEYS[number];
export type AbilityScores = Record<AbilityKey, number>;
export type AbilityPins = Partial<Record<AbilityKey, number>>;
export type AbilityGenerationMethod =
  | 'manual'
  | 'standardArray'
  | 'pointBuy'
  | 'roll3d6'
  | 'roll4d6DropLowest';

export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8] as const;
export const POINT_BUY_BUDGETS = [15, 22, 25, 28, 32] as const;
export type PointBuyBudget = typeof POINT_BUY_BUDGETS[number];

export const POINT_BUY_COSTS: Readonly<Record<number, number>> = {
  8: 0,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 6,
  15: 8,
  16: 10,
  17: 13,
  18: 16,
};

export const AUTO_BUY_SCORE_PACKAGES: Readonly<Record<PointBuyBudget, readonly number[]>> = {
  15: [14, 12, 11, 10, 8, 8],
  22: [15, 13, 12, 11, 10, 8],
  25: [15, 14, 13, 12, 10, 8],
  28: [16, 14, 13, 12, 11, 8],
  32: [16, 15, 14, 12, 12, 8],
};

export interface AbilityGenerationRequest {
  method: AbilityGenerationMethod;
  priority?: readonly AbilityKey[];
  primaryAbility?: AbilityKey;
  pins?: AbilityPins;
  pointBuyBudget?: number;
  rollPool?: readonly number[];
  rng?: () => number;
}

export interface AbilityGenerationMetadata {
  priority: AbilityKey[];
  pins: AbilityPins;
  pointBuyBudget?: number;
  pointShares?: Record<AbilityKey, number>;
  rollPool?: number[];
  warnings: string[];
}

export interface AbilityGenerationResult {
  scores: AbilityScores;
  metadata: AbilityGenerationMetadata;
}

export function isAbilityKey(value: unknown): value is AbilityKey {
  return typeof value === 'string' && (ABILITY_KEYS as readonly string[]).includes(value);
}

export function normalizeAbilityPriority(
  priority?: readonly AbilityKey[],
  primaryAbility?: AbilityKey,
): AbilityKey[] {
  const result: AbilityKey[] = [];
  const candidates = priority?.length ? priority : (primaryAbility ? [primaryAbility] : []);

  for (const ability of [...candidates, ...ABILITY_KEYS]) {
    if (isAbilityKey(ability) && !result.includes(ability)) result.push(ability);
  }

  return result;
}

export function normalizeAbilityPins(pins?: AbilityPins): { pins: AbilityPins; warnings: string[] } {
  const normalized: AbilityPins = {};
  const warnings: string[] = [];

  for (const ability of ABILITY_KEYS) {
    const value = pins?.[ability];
    if (value === undefined) continue;
    if (!Number.isFinite(value) || !Number.isInteger(value)) {
      warnings.push(`${ability.toUpperCase()} pin must be a finite integer and was ignored.`);
      continue;
    }
    normalized[ability] = value;
    if (value < 3 || value > 25) {
      warnings.push(`${ability.toUpperCase()} is pinned to the unusual value ${value}.`);
    }
  }

  return { pins: normalized, warnings };
}

export function splitPointBuyBudget(budget: number, priority: readonly AbilityKey[]): Record<AbilityKey, number> {
  const requestedBudget = Math.max(0, Math.floor(Number.isFinite(budget) ? budget : 15));
  const safeBudget = POINT_BUY_BUDGETS.reduce((closest, candidate) =>
    Math.abs(candidate - requestedBudget) < Math.abs(closest - requestedBudget) ? candidate : closest
  , POINT_BUY_BUDGETS[0]);
  const normalizedPriority = normalizeAbilityPriority(priority);
  const shares = Object.fromEntries(ABILITY_KEYS.map(ability => [ability, 0])) as Record<AbilityKey, number>;
  const scorePackage = AUTO_BUY_SCORE_PACKAGES[safeBudget];

  normalizedPriority.forEach((ability, index) => {
    shares[ability] = POINT_BUY_COSTS[scorePackage[index]];
  });

  return shares;
}

export function normalizePointBuyBudget(budget: number | undefined): PointBuyBudget {
  const requestedBudget = Math.max(0, Math.floor(Number.isFinite(budget) ? Number(budget) : 15));
  return POINT_BUY_BUDGETS.reduce((closest, candidate) =>
    Math.abs(candidate - requestedBudget) < Math.abs(closest - requestedBudget) ? candidate : closest
  , POINT_BUY_BUDGETS[0]);
}

export function scoreForPointShare(points: number): number {
  const safePoints = Math.max(0, Math.floor(Number.isFinite(points) ? points : 0));
  let score = 8;
  for (const [candidateScore, cost] of Object.entries(POINT_BUY_COSTS)) {
    if (cost <= safePoints) score = Math.max(score, Number(candidateScore));
  }
  return score;
}

function rollDie(rng: () => number): number {
  const value = Math.min(0.999999999999, Math.max(0, rng()));
  return Math.floor(value * 6) + 1;
}

function rollAbility(method: 'roll3d6' | 'roll4d6DropLowest', rng: () => number): number {
  const dice = method === 'roll3d6' ? 3 : 4;
  const rolls = Array.from({ length: dice }, () => rollDie(rng)).sort((left, right) => right - left);
  return rolls.slice(0, 3).reduce((sum, roll) => sum + roll, 0);
}

export function assignRollPool(
  rollPool: readonly number[],
  priority: readonly AbilityKey[],
  pins?: AbilityPins,
): AbilityScores {
  const normalizedPriority = normalizeAbilityPriority(priority);
  const normalizedPins = normalizeAbilityPins(pins).pins;
  const unpinned = normalizedPriority.filter(ability => normalizedPins[ability] === undefined);
  const sortedPool = [...rollPool]
    .filter(Number.isFinite)
    .map(value => Math.round(value))
    .sort((left, right) => right - left);
  const scores = Object.fromEntries(ABILITY_KEYS.map(ability => [ability, normalizedPins[ability] ?? 10])) as AbilityScores;

  for (let index = 0; index < unpinned.length; index++) {
    scores[unpinned[index]] = sortedPool[index] ?? 10;
  }

  return scores;
}

export function generateAbilityScores(request: AbilityGenerationRequest): AbilityGenerationResult {
  const priority = normalizeAbilityPriority(request.priority, request.primaryAbility);
  const { pins, warnings } = normalizeAbilityPins(request.pins);
  const scores = Object.fromEntries(ABILITY_KEYS.map(ability => [ability, pins[ability] ?? 10])) as AbilityScores;
  const metadata: AbilityGenerationMetadata = { priority, pins, warnings };

  if (request.method === 'manual') return { scores, metadata };

  if (request.method === 'standardArray') {
    priority.forEach((ability, index) => {
      if (pins[ability] === undefined) scores[ability] = STANDARD_ARRAY[index];
    });
    return { scores, metadata };
  }

  if (request.method === 'pointBuy') {
    const pointBuyBudget = normalizePointBuyBudget(request.pointBuyBudget);
    const pointShares = splitPointBuyBudget(pointBuyBudget, priority);
    priority.forEach(ability => {
      if (pins[ability] === undefined) scores[ability] = scoreForPointShare(pointShares[ability]);
    });
    metadata.pointBuyBudget = pointBuyBudget;
    metadata.pointShares = pointShares;
    return { scores, metadata };
  }

  const unpinnedCount = priority.filter(ability => pins[ability] === undefined).length;
  const rng = request.rng ?? Math.random;
  const rollPool = request.rollPool
    ? [...request.rollPool].slice(0, unpinnedCount)
    : Array.from({ length: unpinnedCount }, () => rollAbility(request.method, rng));
  rollPool.sort((left, right) => right - left);
  metadata.rollPool = rollPool;

  return {
    scores: assignRollPool(rollPool, priority, pins),
    metadata,
  };
}

export function validateCompleteAbilityScores(scores: Partial<AbilityScores>): string[] {
  const errors: string[] = [];
  for (const ability of ABILITY_KEYS) {
    const value = scores[ability];
    if (!Number.isFinite(value) || !Number.isInteger(value)) {
      errors.push(`${ability.toUpperCase()} must be a finite integer.`);
    }
  }
  return errors;
}