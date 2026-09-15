import { afterEach, describe, expect, it, vi } from 'vitest';
import { selectCasterItems, selectStaff } from '../../src/data/rod-staff-recommendations';

describe('rod/staff recommendations', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('keeps wizard/sorcerer on arcane staff tradition', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const wizard = selectStaff(18, 200000, 'Wizard');
    const sorcerer = selectStaff(18, 200000, 'Sorcerer');

    expect(wizard.staff).not.toBeNull();
    expect(sorcerer.staff).not.toBeNull();

    const disallowedDivine = new Set([
      'Staff of Healing',
      'Staff of Life',
      'Staff of the Woodlands',
      'Staff of Swarming Insects',
    ]);

    expect(disallowedDivine.has(wizard.staff!.staff.name)).toBe(false);
    expect(disallowedDivine.has(sorcerer.staff!.staff.name)).toBe(false);
  });

  it('allows mixed staff when at least one spell is on cleric list', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const result = selectStaff(14, 60000, 'Cleric');

    expect(result.staff).not.toBeNull();
    expect(result.staff?.staff.name).toBe('Staff of Defense');
  });

  it('keeps druid on divine/nature-oriented staff routing', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const result = selectStaff(18, 200000, 'Druid');

    expect(result.staff).not.toBeNull();

    const disallowedArcane = new Set([
      'Staff of Power',
      'Staff of Evocation',
      'Staff of Fire',
      'Staff of Transmutation',
      'Staff of Illusion',
      'Staff of Enchantment',
    ]);

    expect(disallowedArcane.has(result.staff!.staff.name)).toBe(false);
  });

  it('returns repeatable caster selections in deterministic mode', () => {
    const first = selectCasterItems(18, 200000, 'Wizard', true);
    const second = selectCasterItems(18, 200000, 'Wizard', true);

    expect(second).toEqual(first);
  });
});
