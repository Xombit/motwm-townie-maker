import { afterEach, describe, expect, it, vi } from 'vitest';
import { calculateKitCost, resolveEquipmentOption } from '../../src/data/equipment-resolver';

describe('equipment resolver', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('selects highest applicable level-scaled item', () => {
    const option = [
      { minLevel: 1, item: { name: 'Leather Armor', cost: 10 } },
      { minLevel: 10, item: { name: 'Mithral Shirt', cost: 1100 } },
      { minLevel: 15, item: { name: 'Mithral Shirt +2', cost: 5100 } },
    ];

    const selected = resolveEquipmentOption(option as any, 12);
    expect(selected.name).toBe('Mithral Shirt');
  });

  it('resolves random choice deterministically when random is mocked', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);

    const option = [
      { name: 'Longsword', cost: 15 },
      { name: 'Battleaxe', cost: 10 },
      { name: 'Warhammer', cost: 12 },
    ];

    const selected = resolveEquipmentOption(option as any, 5);
    expect(selected.name).toBe('Warhammer');
  });

  it('calculates total kit cost with quantities and mixed option types', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const total = calculateKitCost(
      {
        weapons: [[{ name: 'Longsword', cost: 15 }, { name: 'Battleaxe', cost: 10 }]] as any,
        armor: [{ minLevel: 1, item: { name: 'Scale Mail', cost: 50 } }] as any,
        shield: { name: 'Heavy Steel Shield', cost: 20 } as any,
        gear: [{ name: 'Backpack', cost: 2, quantity: 1 }] as any,
        ammo: [{ name: 'Arrows', cost: 1, quantity: 20 }] as any,
      },
      5
    );

    expect(total).toBe(107);
  });
});
