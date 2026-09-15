import { describe, expect, it } from 'vitest';
import { shouldConfigureSpells } from '../../src/data/spell-gating';

describe('shouldConfigureSpells', () => {
  it('rejects non-casters', () => {
    const result = shouldConfigureSpells('fighter', 10);
    expect(result).toEqual({ shouldConfigure: false, reason: 'not-caster' });
  });

  it('rejects low-level paladin and ranger spell paths', () => {
    expect(shouldConfigureSpells('paladin', 3)).toEqual({ shouldConfigure: false, reason: 'too-low-level' });
    expect(shouldConfigureSpells('ranger', 1)).toEqual({ shouldConfigure: false, reason: 'too-low-level' });
  });

  it('accepts eligible casters and supports case-insensitive class names', () => {
    expect(shouldConfigureSpells('Wizard', 5)).toEqual({ shouldConfigure: true, reason: 'ok' });
    expect(shouldConfigureSpells('PALADIN', 4)).toEqual({ shouldConfigure: true, reason: 'ok' });
  });

  it('accepts NPC-suffixed caster names and adept NPC casters', () => {
    expect(shouldConfigureSpells('Cleric (NPC)', 6)).toEqual({ shouldConfigure: true, reason: 'ok' });
    expect(shouldConfigureSpells('Adept (NPC)', 6)).toEqual({ shouldConfigure: true, reason: 'ok' });
  });
});
