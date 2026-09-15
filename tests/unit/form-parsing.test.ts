import { describe, expect, it } from 'vitest';
import { parseBudgetPercentToDecimal, parseIntegerWithFallback } from '../../src/ui/form-parsing';

describe('form parsing utilities', () => {
  it('parses bounded integer values with fallback', () => {
    expect(parseIntegerWithFallback('8', 1, 1, 20)).toBe(8);
    expect(parseIntegerWithFallback('0', 1, 1, 20)).toBe(1);
    expect(parseIntegerWithFallback('99', 1, 1, 20)).toBe(20);
    expect(parseIntegerWithFallback('abc', 1, 1, 20)).toBe(1);
  });

  it('parses budget percentages to stable decimal fractions', () => {
    expect(parseBudgetPercentToDecimal('60')).toBe(0.6);
    expect(parseBudgetPercentToDecimal('12.5')).toBe(0.125);
    expect(parseBudgetPercentToDecimal('12,5')).toBe(0.125);
  });

  it('rejects invalid budget inputs', () => {
    expect(parseBudgetPercentToDecimal('')).toBeNull();
    expect(parseBudgetPercentToDecimal('-1')).toBeNull();
    expect(parseBudgetPercentToDecimal('105')).toBeNull();
    expect(parseBudgetPercentToDecimal('abc')).toBeNull();
  });
});
