import { afterEach, describe, expect, it, vi } from 'vitest';
import { D35EAdapter } from '../../src/d35e-adapter';

function makeActorMock() {
  return {
    createEmbeddedDocuments: vi.fn().mockResolvedValue([]),
    update: vi.fn().mockResolvedValue(undefined),
    system: { currency: { pp: 0, gp: 0, sp: 0, cp: 0 } },
  } as any;
}

describe('D35EAdapter.addSrdLootPack profile wiring', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('passes the selected loot profile multipliers into TreasureGenerator', async () => {
    const makeTreasureFromCR = vi.fn().mockResolvedValue(undefined);
    const toItemPfArr = vi.fn(async function* () {
      // no-op generator
    });

    class FakeTreasureGenerator {
      treasure = { pp: 0, gp: 0, sp: 0, cp: 0 };
      makeTreasureFromCR = makeTreasureFromCR;
      toItemPfArr = toItemPfArr;
    }

    vi.stubGlobal('game', {
      D35E: {
        TreasureGenerator: FakeTreasureGenerator,
      },
    });

    const actor = makeActorMock();

    await D35EAdapter.addSrdLootPack(actor, 8, false, 'double_goods_items');

    expect(makeTreasureFromCR).toHaveBeenCalledTimes(1);
    const [levelsArg, optionsArg] = makeTreasureFromCR.mock.calls[0];
    expect(levelsArg).toEqual([
      { cr: 8, moneyMultiplier: 1, goodsMultiplier: 2, itemsMultiplier: 2 },
    ]);
    expect(optionsArg).toMatchObject({ identified: false, tradeGoodsToGold: false, overrideNames: true });
  });

  it('supports none profile by zeroing all multipliers', async () => {
    const makeTreasureFromCR = vi.fn().mockResolvedValue(undefined);
    const toItemPfArr = vi.fn(async function* () {
      // no-op generator
    });

    class FakeTreasureGenerator {
      treasure = { pp: 0, gp: 0, sp: 0, cp: 0 };
      makeTreasureFromCR = makeTreasureFromCR;
      toItemPfArr = toItemPfArr;
    }

    vi.stubGlobal('game', {
      D35E: {
        TreasureGenerator: FakeTreasureGenerator,
      },
    });

    const actor = makeActorMock();

    await D35EAdapter.addSrdLootPack(actor, 5, true, 'none');

    const [levelsArg] = makeTreasureFromCR.mock.calls[0];
    expect(levelsArg).toEqual([
      { cr: 5, moneyMultiplier: 0, goodsMultiplier: 0, itemsMultiplier: 0 },
    ]);
  });
});
