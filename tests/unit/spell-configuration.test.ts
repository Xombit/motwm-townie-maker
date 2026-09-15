import { afterEach, describe, expect, it, vi } from 'vitest';
import { addSpellsToActor } from '../../src/data/spell-configuration';

describe('addSpellsToActor', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    // @ts-ignore
    delete globalThis.game;
  });

  it('passes ignoreSpellbookAndLevel when importing spells', async () => {
    const createEmbeddedDocuments = vi.fn().mockResolvedValue([]);
    const spellDoc = {
      toObject: () => ({
        name: 'Bless',
        type: 'spell',
        system: {},
      }),
    };
    const spellPack = {
      getIndex: vi.fn().mockResolvedValue(undefined),
      getDocument: vi.fn().mockResolvedValue(spellDoc),
      index: [{ id: 'spell-1', name: 'Bless' }],
    };

    // @ts-ignore
    globalThis.game = {
      packs: new Map([['D35E.spells', spellPack]]),
    };

    const actor = {
      name: 'Test Actor',
      createEmbeddedDocuments,
    } as any;

    await addSpellsToActor(actor, {
      spells: [
        {
          compendiumId: 'bless',
          name: 'Bless',
          level: 1,
          school: 'enc',
          preparationMode: 'prepared',
          priority: 10,
        },
      ],
      spellbookConfig: {
        name: 'Primary',
        class: 'cleric',
        casterLevel: 1,
        spellcastingType: 'divine',
        ability: 'wis',
        spontaneous: false,
        hasSpecialSlot: true,
        arcaneSpellFailure: false,
        spellSlots: {
          spell0: { max: 0 },
          spell1: { max: 1 },
          spell2: { max: 0 },
          spell3: { max: 0 },
          spell4: { max: 0 },
          spell5: { max: 0 },
          spell6: { max: 0 },
          spell7: { max: 0 },
          spell8: { max: 0 },
          spell9: { max: 0 },
        },
      },
    });

    expect(createEmbeddedDocuments).toHaveBeenCalledTimes(1);
    expect(createEmbeddedDocuments).toHaveBeenCalledWith('Item', expect.any(Array), {
      ignoreSpellbookAndLevel: true,
      stopUpdates: true,
      nameUnique: true,
    });
  });
});
