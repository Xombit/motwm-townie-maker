import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { D35EAdapter } from '../../src/d35e-adapter';

type FakePack = {
  getDocument: ReturnType<typeof vi.fn>;
  getIndex: ReturnType<typeof vi.fn>;
};

function makeActorMock() {
  return {
    name: 'Test Actor',
    system: {
      traits: {
        tokenSize: 'med',
        size: 'med',
      },
    },
    createEmbeddedDocuments: vi.fn().mockResolvedValue([{}]),
    update: vi.fn().mockResolvedValue(undefined),
  } as any;
}

describe('D35EAdapter compendium lookup hardening', () => {
  beforeEach(() => {
    vi.stubGlobal('CONFIG', { D35E: { tokenSizes: { med: 1 } } });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('resolves race by normalized fallback name when hardcoded id path misses', async () => {
    const actor = makeActorMock();

    const raceDoc = { toObject: () => ({ name: 'Human', type: 'race' }) };
    const racePack: FakePack = {
      getDocument: vi.fn().mockResolvedValue(raceDoc),
      getIndex: vi.fn().mockResolvedValue([{ name: 'Human', id: 'race-human-id' }]),
    };

    vi.stubGlobal('game', {
      packs: {
        get: (id: string) => (id === 'D35E.racialfeatures' ? racePack : null),
      },
    });

    await D35EAdapter.addRace(actor, 'human');

    expect(racePack.getIndex).toHaveBeenCalledTimes(1);
    expect(racePack.getDocument).toHaveBeenCalledWith('race-human-id');
    expect(actor.createEmbeddedDocuments).toHaveBeenCalledWith('Item', [{ name: 'Human', type: 'race' }]);
  });

  it('resolves class by normalized fallback name when hardcoded id path misses', async () => {
    const actor = makeActorMock();

    const classDoc = {
      system: { hd: 10 },
      toObject: () => ({ name: 'Fighter', type: 'class', system: {} }),
    };

    const classPack: FakePack = {
      getDocument: vi.fn().mockResolvedValue(classDoc),
      getIndex: vi.fn().mockResolvedValue([{ name: 'Fighter', id: 'class-fighter-id' }]),
    };

    vi.stubGlobal('game', {
      packs: {
        get: (id: string) => (id === 'D35E.classes' ? classPack : null),
      },
    });

    await D35EAdapter.addClass(actor, 'fighter', 5);

    expect(classPack.getIndex).toHaveBeenCalledTimes(1);
    expect(classPack.getDocument).toHaveBeenCalledWith('class-fighter-id');
    expect(actor.createEmbeddedDocuments).toHaveBeenCalledTimes(1);
  });

  it('throws clear error when fallback entry resolves but document load fails', async () => {
    const actor = makeActorMock();

    const classPack: FakePack = {
      getDocument: vi.fn().mockResolvedValue(null),
      getIndex: vi.fn().mockResolvedValue([{ name: 'Fighter', id: 'class-fighter-id' }]),
    };

    vi.stubGlobal('game', {
      packs: {
        get: (id: string) => (id === 'D35E.classes' ? classPack : null),
      },
    });

    await expect(D35EAdapter.addClass(actor, 'fighter', 5)).rejects.toThrow(
      "Class 'fighter' entry resolved but document 'class-fighter-id' could not be loaded"
    );
  });
});
