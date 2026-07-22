export type SRDLootProfileId =
  | "standard"
  | "none"
  | "double_goods_items"
  | "percent_goods_items_50";

export interface SRDLootProfile {
  id: SRDLootProfileId;
  label: string;
  description: string;
  moneyMultiplier: number;
  goodsMultiplier: number;
  itemsMultiplier: number;
  goodsChance?: number;
  itemsChance?: number;
}

export const SRD_LOOT_PROFILES: SRDLootProfile[] = [
  {
    id: "standard",
    label: "Standard (SRD)",
    description: "One independent roll each for Coins, Goods, and Items.",
    moneyMultiplier: 1,
    goodsMultiplier: 1,
    itemsMultiplier: 1,
  },
  {
    id: "none",
    label: "None",
    description: "No generated coins, goods, or items.",
    moneyMultiplier: 0,
    goodsMultiplier: 0,
    itemsMultiplier: 0,
  },
  {
    id: "double_goods_items",
    label: "Double Goods/Items",
    description: "Coins standard; Goods and Items roll twice.",
    moneyMultiplier: 1,
    goodsMultiplier: 2,
    itemsMultiplier: 2,
  },
  {
    id: "percent_goods_items_50",
    label: "% Goods/Items (50%)",
    description: "Coins standard; Goods/Items each have a 50% chance to roll once.",
    moneyMultiplier: 1,
    goodsMultiplier: 1,
    itemsMultiplier: 1,
    goodsChance: 0.5,
    itemsChance: 0.5,
  },
];

export function getSRDLootProfile(profileId: SRDLootProfileId | undefined): SRDLootProfile {
  if (!profileId) return SRD_LOOT_PROFILES[0];
  return SRD_LOOT_PROFILES.find((p) => p.id === profileId) || SRD_LOOT_PROFILES[0];
}

export function buildTreasureLevelFromProfile(cr: number, profileId: SRDLootProfileId | undefined): {
  cr: number;
  moneyMultiplier: number;
  goodsMultiplier: number;
  itemsMultiplier: number;
} {
  const profile = getSRDLootProfile(profileId);

  const goodsMultiplier = profile.goodsChance !== undefined
    ? (Math.random() < profile.goodsChance ? profile.goodsMultiplier : 0)
    : profile.goodsMultiplier;

  const itemsMultiplier = profile.itemsChance !== undefined
    ? (Math.random() < profile.itemsChance ? profile.itemsMultiplier : 0)
    : profile.itemsMultiplier;

  return {
    cr,
    moneyMultiplier: profile.moneyMultiplier,
    goodsMultiplier,
    itemsMultiplier,
  };
}
