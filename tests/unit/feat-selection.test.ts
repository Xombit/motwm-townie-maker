import { describe, expect, it } from 'vitest';
import {
  allocateFeats,
  RangerCombatStyle,
  getRangerArcheryFeats,
  getRangerTwoWeaponFeats,
} from '../../src/data/feat-selection';

describe('feat selection allocation', () => {
  it('defers level-gated fighter feats until prerequisites are met', () => {
    const templateFeats = ['Greater Weapon Focus', 'Power Attack', 'Weapon Specialization'];

    const allocations = allocateFeats('fighter', 8, false, templateFeats);
    const byFeat = Object.fromEntries(
      allocations.map((allocation) => [
        typeof allocation.feat === 'string' ? allocation.feat : allocation.feat.name,
        allocation.level,
      ])
    );

    expect(byFeat['Power Attack']).toBe(1);
    expect(byFeat['Weapon Specialization']).toBeGreaterThanOrEqual(4);
    expect(byFeat['Greater Weapon Focus']).toBeGreaterThanOrEqual(8);
  });

  it('includes ranger combat style feats at correct levels', () => {
    const allocations = allocateFeats(
      'ranger',
      11,
      false,
      ['Track', 'Endurance', 'Improved Initiative'],
      RangerCombatStyle.ARCHERY
    );

    const rangerStyleFeats = allocations
      .filter((allocation) => allocation.source === 'ranger-style')
      .map((allocation) => allocation.feat);

    expect(rangerStyleFeats).toEqual(getRangerArcheryFeats(11));
    expect(rangerStyleFeats).not.toEqual(getRangerTwoWeaponFeats(11));
  });
});
