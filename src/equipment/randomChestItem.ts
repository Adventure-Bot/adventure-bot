import { weightedTable } from "../utils/weightedTable";
import { Item } from "./Item";
import {
  amuletOfAttack,
  amuletOfProtection,
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

export function randomChestItem(): Item {
  return weightedTable<() => Item>([
    [0.1, amuletOfAttack],
    [0.1, amuletOfProtection],
    [0.1, ringOfAttack],
    [0.5, plateArmor],
    [0.5, towerShield],
    [0.5, warAxe],
    [1, chainArmor],
    [1, kiteShield],
    [1, longsword],
    [1, mace],
    [1.2, buckler],
    [1.2, leatherArmor],
    [1.3, dagger],
  ])();
}
