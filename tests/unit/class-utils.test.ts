import { describe, expect, it } from 'vitest';
import {
  getPrimaryClassToken,
  isDivineClass,
  isPureArcaneClass,
  toCoreClassKey,
} from '../../src/data/class-utils';

describe('class utils', () => {
  it('normalizes NPC class labels to primary tokens', () => {
    expect(getPrimaryClassToken('Adept (NPC)')).toBe('adept');
    expect(getPrimaryClassToken('Warrior (NPC)')).toBe('warrior');
    expect(getPrimaryClassToken(' Wizard  ')).toBe('wizard');
  });

  it('maps NPC classes to core class behaviors', () => {
    expect(toCoreClassKey('Adept (NPC)')).toBe('cleric');
    expect(toCoreClassKey('Expert (NPC)')).toBe('rogue');
    expect(toCoreClassKey('Warrior (NPC)')).toBe('fighter');
  });

  it('detects divine and pure arcane classes with NPC labels', () => {
    expect(isDivineClass('Adept (NPC)')).toBe(true);
    expect(isDivineClass('Cleric')).toBe(true);
    expect(isDivineClass('Fighter')).toBe(false);

    expect(isPureArcaneClass('Wizard')).toBe(true);
    expect(isPureArcaneClass('Sorcerer')).toBe(true);
    expect(isPureArcaneClass('Adept (NPC)')).toBe(false);
  });
});
