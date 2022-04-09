import {
  Item,
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
  warAxe,
} from '@adventure-bot/game/equipment'
import {
  assassinLeathers,
  berserkerHides,
  travelersRing,
} from '@adventure-bot/game/equipment/items'
import { weightedTable } from '@adventure-bot/game/utils'

export function randomShopItem(): Item {
  return weightedTable<() => Item>([
    [0.3, amuletOfAttack],
    [0.3, amuletOfProtection],
    [0.8, assassinLeathers],
    [0.8, berserkerHides],
    [1, buckler],
    [1, chainArmor],
    [1, dagger],
    [1, kiteShield],
    [1, leatherArmor],
    [1, longsword],
    [1, mace],
    [0.8, plateArmor],
    [1, potionOfHealing],
    [1, potionOfMight],
    [1, potionOfProtection],
    [1, potionOfSlaying],
    [1, potionOfVigor],
    [0.3, ringOfAttack],
    [1, towerShield],
    [1, travelersRing],
    [0.5, warAxe],
  ])()
}
