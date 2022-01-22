import { Item } from '@adventure-bot/equipment/Item'
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
  potionOfHealing,
  potionOfMight,
  potionOfProtection,
  potionOfSlaying,
  potionOfVigor,
  ringOfAttack,
  towerShield,
  unidentifiedPotion,
  warAxe,
} from '@adventure-bot/equipment/items'
import { weightedTable } from '@adventure-bot/utils'

export function randomChestItem(): Item {
  return weightedTable<() => Item>([
    [0.1, amuletOfAttack],
    [0.1, amuletOfProtection],
    [0.1, ringOfAttack],
    [0.5, plateArmor],
    [0.5, towerShield],
    [0.5, warAxe],
    [0.5, potionOfMight],
    [0.5, potionOfProtection],
    [0.5, potionOfSlaying],
    [0.5, potionOfVigor],
    [1, potionOfHealing],
    [1, chainArmor],
    [1, kiteShield],
    [1, longsword],
    [1, unidentifiedPotion],
    [1, mace],
    [1.2, buckler],
    [1.2, leatherArmor],
    [1.3, dagger],
  ])()
}
