import { weightedRandom } from "../utils/weightedRandom";

import { Item } from "./Item";
import {
  buckler,
  chainArmor,
  dagger,
  kiteShield,
  leatherArmor,
  longsword,
  mace,
  plateArmor,
  ringOfAttack,
  towerShield,
  warAxe,
} from "./items";
import { amuletOfAttack } from "./items/amuletOfAttack";
import { amuletOfProtection } from "./items/amuletOfProtection";

export const weights = new Map<() => Item, number>([
  [amuletOfAttack, 0.3],
  [amuletOfProtection, 0.3],
  [buckler, 1],
  [chainArmor, 1],
  [dagger, 1],
  [kiteShield, 1],
  [leatherArmor, 1],
  [longsword, 1],
  [mace, 1],
  [plateArmor, 1],
  [ringOfAttack, 0.3],
  [towerShield, 1],
  [warAxe, 0.5],
]);

export function randomShopItem(): Item {
  return Array.from(weights.keys())[
    weightedRandom(Array.from(weights.values()))
  ]();
}
