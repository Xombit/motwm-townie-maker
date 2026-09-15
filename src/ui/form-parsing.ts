export function parseIntegerWithFallback(value: string, fallback: number, min?: number, max?: number): number {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;

  let next = parsed;
  if (typeof min === 'number') next = Math.max(min, next);
  if (typeof max === 'number') next = Math.min(max, next);
  return next;
}

export function parseBudgetPercentToDecimal(value: string): number | null {
  const normalized = value.replace(',', '.').trim();
  if (!normalized) return null;

  const parsed = Number.parseFloat(normalized);
  if (!Number.isFinite(parsed)) return null;
  if (parsed < 0 || parsed > 100) return null;

  // Keep stable precision to avoid noisy floating-point drift in repeated edits.
  return Number((parsed / 100).toFixed(4));
}
