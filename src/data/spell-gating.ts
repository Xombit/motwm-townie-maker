import { isCasterClass, normalizeSpellClassName } from './spell-selection';

export interface SpellGatingResult {
  shouldConfigure: boolean;
  reason: 'not-caster' | 'too-low-level' | 'ok';
}

export function shouldConfigureSpells(className: string, level: number): SpellGatingResult {
  const normalized = normalizeSpellClassName(className);

  if (!isCasterClass(normalized)) {
    return { shouldConfigure: false, reason: 'not-caster' };
  }

  if ((normalized === 'paladin' || normalized === 'ranger') && level < 4) {
    return { shouldConfigure: false, reason: 'too-low-level' };
  }

  return { shouldConfigure: true, reason: 'ok' };
}
