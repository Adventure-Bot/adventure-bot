import {
  Item,
  amuletOfAttack,
  amuletOfProtection,
  assassinLeathers,
  berserkerHides,
  boomstick,
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
import { weightedRandom } from '@adventure-bot/game/utils'

const weights = new Map<() => Item, number>([
  [boomstick, 0.1],
  [amuletOfAttack, 0.3],
  [amuletOfProtection, 0.3],
  [buckler, 1],
  [chainArmor, 1],
  [dagger, 1],
  [kiteShield, 1],
  [leatherArmor, 1],
  [longsword, 1],
  [mace, 1],
  [plateArmor, 0.8],
  [assassinLeathers, 0.8],
  [berserkerHides, 0.8],
  [potionOfHealing, 1],
  [potionOfMight, 1],
  [potionOfProtection, 1],
  [potionOfSlaying, 1],
  [potionOfVigor, 1],
  [ringOfAttack, 0.3],
  [towerShield, 1],
  [warAxe, 0.5],
])

export function randomShopItem(): Item {
  return Array.from(weights.keys())[
    weightedRandom(Array.from(weights.values()))
  ]()
}
