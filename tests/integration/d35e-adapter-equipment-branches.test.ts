import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { D35EAdapter } from '../../src/d35e-adapter';

const getWealthForLevelMock = vi.fn();
const calculateKitCostMock = vi.fn();
const selectMagicItemsMock = vi.fn();
const addWondrousItemsToActorMock = vi.fn();
const addRodsAndStaffToActorMock = vi.fn();

vi.mock('../../src/data/wealth', () => ({
  getWealthForLevel: getWealthForLevelMock,
  convertToCoins: vi.fn(),
  CLASS_STARTING_WEALTH: {
    Fighter: 150,
    'Adept (NPC)': 50,
  },
}));

vi.mock('../../src/data/equipment-resolver', () => ({
  calculateKitCost: calculateKitCostMock,
}));

vi.mock('../../src/data/magic-item-system', () => ({
  selectMagicItems: selectMagicItemsMock,
  addWondrousItemsToActor: addWondrousItemsToActorMock,
}));

vi.mock('../../src/data/rod-staff-creation', () => ({
  addRodsAndStaffToActor: addRodsAndStaffToActorMock,
}));

function makeActorMock(items: any[] = []) {
  return {
    name: 'Test NPC',
    system: {
      abilities: {
        str: { total: 10, value: 10 },
      },
    },
    items,
    updateEmbeddedDocuments: vi.fn().mockResolvedValue(undefined),
  } as any;
}

describe('D35EAdapter.addEquipment NPC branch coverage', () => {
  beforeEach(() => {
    getWealthForLevelMock.mockReset().mockReturnValue(5000);
    calculateKitCostMock.mockReset().mockReturnValue(125);
    selectMagicItemsMock.mockReset().mockResolvedValue({
      totalCost: 1000,
      overspend: 0,
      wondrousItems: [],
      hasScarabOfProtection: false,
      hasHandyHaversack: false,
      wands: [],
      scrolls: [],
      potions: [],
      rods: [],
      staff: null,
    });
    addWondrousItemsToActorMock.mockReset().mockResolvedValue(undefined);
    addRodsAndStaffToActorMock.mockReset().mockResolvedValue({
      createdIds: [],
      createdCost: 0,
      failed: [],
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('adds mundane gear and token gold when standard budget is disabled', async () => {
    const actor = makeActorMock();
    const addMundaneSpy = vi.spyOn(D35EAdapter as any, 'addMundaneItems').mockResolvedValue(undefined);
    const addCoinsSpy = vi.spyOn(D35EAdapter as any, 'addCoins').mockResolvedValue(undefined);

    await D35EAdapter.addEquipment(
      actor,
      {
        name: 'No Budget NPC',
        classes: [{ name: 'Warrior (NPC)', level: 6 }],
        useStandardBudget: false,
        startingKit: { weapons: [{ name: 'Club', cost: 0 }] },
      },
      6,
      false,
      false,
      'The First Bank of Lower Everbrook',
      true
    );

    expect(selectMagicItemsMock).not.toHaveBeenCalled();
    expect(addMundaneSpy).toHaveBeenCalledTimes(1);
    expect(addCoinsSpy).toHaveBeenCalledTimes(1);
    expect(addCoinsSpy.mock.calls[0]?.[1]).toBeGreaterThan(0);
  });

  it.each([
    { useNpcWealth: true, label: 'npc wealth enabled' },
    { useNpcWealth: false, label: 'npc wealth disabled' },
  ])('routes NPC wealth flag to budget calculation ($label)', async ({ useNpcWealth }) => {
    const actor = makeActorMock();
    vi.spyOn(D35EAdapter as any, 'addMundaneItems').mockResolvedValue(undefined);
    vi.spyOn(D35EAdapter as any, 'addCoins').mockResolvedValue(undefined);

    await D35EAdapter.addEquipment(
      actor,
      {
        name: 'Adept Budget NPC',
        classes: [{ name: 'Adept (NPC)', level: 8 }],
        useStandardBudget: true,
        startingKit: { weapons: [{ name: 'Sling', cost: 0 }] },
      },
      8,
      false,
      false,
      'The First Bank of Lower Everbrook',
      useNpcWealth
    );

    expect(getWealthForLevelMock).toHaveBeenCalledWith(8, 'Adept (NPC)', useNpcWealth);
    expect(selectMagicItemsMock).toHaveBeenCalledTimes(1);
  });

  it('refunds failed magic creation back into coin remainder', async () => {
    const actor = makeActorMock();
    const addMundaneSpy = vi.spyOn(D35EAdapter as any, 'addMundaneItems').mockResolvedValue(undefined);
    const addCoinsSpy = vi.spyOn(D35EAdapter as any, 'addCoins').mockResolvedValue(undefined);

    selectMagicItemsMock.mockResolvedValueOnce({
      totalCost: 1000,
      overspend: 0,
      weaponCost: 0,
      secondaryWeaponCost: 0,
      armorCost: 0,
      shieldCost: 0,
      wondrousItems: [{ name: 'Ring of Protection +1', price: 2000 }],
      hasScarabOfProtection: false,
      hasHandyHaversack: false,
      wands: [],
      scrolls: [],
      potions: [],
      rods: [],
      staff: null,
    });

    addWondrousItemsToActorMock.mockResolvedValueOnce({
      createdIds: [],
      createdCost: 0,
      failed: [{ name: 'Ring of Protection +1', reason: 'create_failed', plannedCost: 2000 }],
    });

    await D35EAdapter.addEquipment(
      actor,
      {
        name: 'Refund Test NPC',
        classes: [{ name: 'Adept (NPC)', level: 8 }],
        useStandardBudget: true,
        startingKit: { weapons: [{ name: 'Sling', cost: 0 }] },
      },
      8,
      false,
      false,
      'The First Bank of Lower Everbrook',
      true
    );

    expect(addMundaneSpy).toHaveBeenCalledTimes(1);
    // 5000 wealth - 125 mundane - 0 created magic spend = 4875
    expect(addCoinsSpy).toHaveBeenCalledWith(actor, 4875);
  });

  it('uses reserve percentage to reduce effective magic budget', async () => {
    const actor = makeActorMock();
    vi.spyOn(D35EAdapter as any, 'addMundaneItems').mockResolvedValue(undefined);
    vi.spyOn(D35EAdapter as any, 'addCoins').mockResolvedValue(undefined);

    await D35EAdapter.addEquipment(
      actor,
      {
        name: 'Reserve Budget NPC',
        classes: [{ name: 'Adept (NPC)', level: 8 }],
        useStandardBudget: true,
        startingKit: { weapons: [{ name: 'Sling', cost: 0 }] },
      },
      8,
      false,
      false,
      'The First Bank of Lower Everbrook',
      true,
      50,
      true
    );

    // 5000 wealth - 125 mundane = 4875 gross; reserve floor(2437.5)=2437, effective budget 4875-2437=2438
    expect(selectMagicItemsMock).toHaveBeenCalledWith(8, 'Adept (NPC)', 2438, undefined, 10, false);
  });

  it('uses complete plan wealth multiplier and reserve and passes the plan to selection', async () => {
    const actor = makeActorMock();
    vi.spyOn(D35EAdapter as any, 'addMundaneItems').mockResolvedValue(undefined);
    const addCoinsSpy = vi.spyOn(D35EAdapter as any, 'addCoins').mockResolvedValue(undefined);
    const spendingPlan = {
      version: 1,
      preset: 'defensive',
      wealth: { mode: 'npcWealth', multiplierPercent: 80, reservePercent: 10 },
    };
    selectMagicItemsMock.mockResolvedValueOnce({
      totalCost: 1000,
      overspend: 0,
      spendingReport: {
        spendableGp: 3488,
        totalSpentGp: 1000,
        finalCashGp: 2488,
        stages: [],
        warnings: [],
      },
      weaponCost: 0,
      secondaryWeaponCost: 0,
      armorCost: 0,
      shieldCost: 0,
      wondrousItems: [],
      hasScarabOfProtection: false,
      hasHandyHaversack: false,
      wands: [],
      scrolls: [],
      potions: [],
      rods: [],
      staff: null,
    });

    await D35EAdapter.addEquipment(
      actor,
      {
        name: 'Planned Guard',
        classes: [{ name: 'Fighter', level: 8 }],
        useStandardBudget: true,
        spendingPlan,
        startingKit: { weapons: [{ name: 'Longsword', cost: 15 }] },
      },
      8,
      false,
      false,
      'The First Bank of Lower Everbrook',
      false,
      0,
      true
    );

    // floor(5000 * 80%) - 125 mundane = 3875; reserve floor(10%) = 387.
    expect(getWealthForLevelMock).toHaveBeenCalledWith(8, 'Fighter', true);
    expect(selectMagicItemsMock).toHaveBeenCalledWith(8, 'Fighter', 3488, undefined, 10, false, spendingPlan, true);
    expect(addCoinsSpy).toHaveBeenCalledWith(actor, 3875);
  });

  it('deposits full remainder when pocket change is disabled', async () => {
    const actor = makeActorMock();
    vi.spyOn(D35EAdapter as any, 'addMundaneItems').mockResolvedValue(undefined);
    const addCoinsSpy = vi.spyOn(D35EAdapter as any, 'addCoins').mockResolvedValue(undefined);
    const createDepositSpy = vi.spyOn(D35EAdapter as any, 'createBankDepositSlip').mockResolvedValue(undefined);

    await D35EAdapter.addEquipment(
      actor,
      {
        name: 'No Pocket Change NPC',
        classes: [{ name: 'Adept (NPC)', level: 8 }],
        useStandardBudget: true,
        startingKit: { weapons: [{ name: 'Sling', cost: 0 }] },
      },
      8,
      false,
      true,
      'The First Bank of Lower Everbrook',
      true,
      0,
      false
    );

    expect(createDepositSpy).toHaveBeenCalledWith(actor, 4875, 'The First Bank of Lower Everbrook');
    expect(addCoinsSpy).not.toHaveBeenCalled();
  });

  it('keeps staff equipped and rods unequipped for caster builds when both are present', async () => {
    const actor = makeActorMock([
      {
        id: 'rod-1',
        type: 'equipment',
        name: 'Lesser Metamagic Rod of Extend Spell',
        system: { equipped: true, carried: true },
      },
      {
        id: 'staff-1',
        type: 'equipment',
        name: 'Staff of Fire',
        system: { equipped: false, carried: true },
      },
    ]);

    vi.spyOn(D35EAdapter as any, 'addMundaneItems').mockResolvedValue(undefined);
    vi.spyOn(D35EAdapter as any, 'addCoins').mockResolvedValue(undefined);

    selectMagicItemsMock.mockResolvedValueOnce({
      totalCost: 1000,
      overspend: 0,
      weaponCost: 0,
      secondaryWeaponCost: 0,
      armorCost: 0,
      shieldCost: 0,
      wondrousItems: [],
      hasScarabOfProtection: false,
      hasHandyHaversack: false,
      wands: [],
      scrolls: [],
      potions: [],
      rods: [{ rod: { id: 'rod-id', name: 'Lesser Metamagic Rod of Extend Spell', price: 3000 } }],
      staff: { staff: { id: 'staff-id', name: 'Staff of Fire', price: 17750, charges: 10 } },
    });

    await D35EAdapter.addEquipment(
      actor,
      {
        name: 'Adept Caster NPC',
        classes: [{ name: 'Adept (NPC)', level: 8 }],
        useStandardBudget: true,
        startingKit: { weapons: [{ name: 'Dagger', cost: 0 }] },
      },
      8,
      false,
      false,
      'The First Bank of Lower Everbrook',
      true
    );

    expect(addRodsAndStaffToActorMock).toHaveBeenCalledTimes(1);
    const updates = (actor.updateEmbeddedDocuments as any).mock.calls[0]?.[1] || [];
    const rodUpdate = updates.find((u: any) => u._id === 'rod-1');
    const staffUpdate = updates.find((u: any) => u._id === 'staff-1');

    expect(rodUpdate?.system?.equipped).toBe(false);
    expect(rodUpdate?.system?.carried).toBe(true);
    expect(staffUpdate?.system?.equipped).toBe(true);
    expect(staffUpdate?.system?.carried).toBe(true);
  });

  it('keeps melee cleric weapon and shield equipped', async () => {
    const actor = makeActorMock([
      {
        id: 'weapon-1',
        type: 'weapon',
        name: 'Heavy Mace',
        system: { equipped: false, carried: false },
      },
      {
        id: 'shield-1',
        type: 'equipment',
        name: 'Heavy Steel Shield',
        system: { equipped: false, carried: false },
      },
      {
        id: 'rod-1',
        type: 'equipment',
        name: 'Lesser Metamagic Rod of Extend Spell',
        system: { equipped: false, carried: false },
      },
    ]);

    vi.spyOn(D35EAdapter as any, 'addMundaneItems').mockResolvedValue(undefined);
    vi.spyOn(D35EAdapter as any, 'addCoins').mockResolvedValue(undefined);

    await D35EAdapter.addEquipment(
      actor,
      {
        name: 'Battle Cleric NPC',
        classes: [{ name: 'Cleric', level: 8 }],
        useStandardBudget: true,
        startingKit: {
          weapons: [{ name: 'Heavy Mace', cost: 0 }],
          shield: { name: 'Heavy Steel Shield', cost: 0 },
        },
      },
      8,
      false,
      false,
      'The First Bank of Lower Everbrook',
      true
    );

    const updates = (actor.updateEmbeddedDocuments as any).mock.calls[0]?.[1] || [];
    const weaponUpdate = updates.find((u: any) => u._id === 'weapon-1');
    const shieldUpdate = updates.find((u: any) => u._id === 'shield-1');

    expect(weaponUpdate?.system?.equipped).toBe(true);
    expect(weaponUpdate?.system?.carried).toBe(true);
    expect(shieldUpdate?.system?.equipped).toBe(true);
    expect(shieldUpdate?.system?.carried).toBe(true);
  });

  it('equips caster cleric armor and primary weapon even without a staff', async () => {
    const actor = makeActorMock([
      {
        id: 'weapon-1',
        type: 'weapon',
        name: 'Quarterstaff',
        system: { equipped: false, carried: false },
      },
      {
        id: 'armor-1',
        type: 'equipment',
        name: 'Chainmail',
        system: { equipped: false, carried: false },
      },
      {
        id: 'rod-1',
        type: 'equipment',
        name: 'Lesser Metamagic Rod of Extend Spell',
        system: { equipped: false, carried: false },
      },
    ]);

    vi.spyOn(D35EAdapter as any, 'addMundaneItems').mockResolvedValue(undefined);
    vi.spyOn(D35EAdapter as any, 'addCoins').mockResolvedValue(undefined);

    await D35EAdapter.addEquipment(
      actor,
      {
        name: 'Caster Cleric NPC',
        classes: [{ name: 'Cleric', level: 14 }],
        useStandardBudget: true,
        startingKit: {
          weapons: [{ name: 'Quarterstaff', cost: 0 }],
          armor: { name: 'Chainmail', cost: 150 },
        },
      },
      14,
      false,
      false,
      'The First Bank of Lower Everbrook',
      true
    );

    const updates = (actor.updateEmbeddedDocuments as any).mock.calls[0]?.[1] || [];
    const weaponUpdate = updates.find((u: any) => u._id === 'weapon-1');
    const armorUpdate = updates.find((u: any) => u._id === 'armor-1');

    expect(weaponUpdate?.system?.equipped).toBe(true);
    expect(weaponUpdate?.system?.carried).toBe(true);
    expect(armorUpdate?.system?.equipped).toBe(true);
    expect(armorUpdate?.system?.carried).toBe(true);
  });

  it('allows two rods equipped when no staff is present for caster builds', async () => {
    const actor = makeActorMock([
      {
        id: 'rod-1',
        type: 'equipment',
        name: 'Lesser Metamagic Rod of Extend Spell',
        system: { equipped: false, carried: false },
      },
      {
        id: 'rod-2',
        type: 'equipment',
        name: 'Lesser Metamagic Rod of Empower Spell',
        system: { equipped: false, carried: false },
      },
      {
        id: 'rod-3',
        type: 'equipment',
        name: 'Lesser Metamagic Rod of Silent Spell',
        system: { equipped: true, carried: true },
      },
    ]);

    vi.spyOn(D35EAdapter as any, 'addMundaneItems').mockResolvedValue(undefined);
    vi.spyOn(D35EAdapter as any, 'addCoins').mockResolvedValue(undefined);

    await D35EAdapter.addEquipment(
      actor,
      {
        name: 'Wizard Rod User',
        classes: [{ name: 'Wizard', level: 14 }],
        useStandardBudget: true,
        startingKit: {
          weapons: [{ name: 'Quarterstaff', cost: 0 }],
        },
      },
      14,
      false,
      false,
      'The First Bank of Lower Everbrook',
      true
    );

    const updates = (actor.updateEmbeddedDocuments as any).mock.calls[0]?.[1] || [];
    const rod1 = updates.find((u: any) => u._id === 'rod-1');
    const rod2 = updates.find((u: any) => u._id === 'rod-2');
    const rod3 = updates.find((u: any) => u._id === 'rod-3');

    expect(rod1?.system?.equipped).toBe(true);
    expect(rod2?.system?.equipped).toBe(true);
    expect(rod3?.system?.equipped).toBe(false);
  });
});
