import { Item } from '@adventure-bot/game/equipment'
import {
  potionOfHaste,
  potionOfHealing,
  potionOfMight,
  potionOfProtection,
  potionOfSlaying,
  potionOfVigor,
  roguesBrew,
  unidentifiedPotion,
} from '@adventure-bot/game/equipment/items'
import { weightedTable } from '@adventure-bot/game/utils'

export function randomPotion(): Item {
  return weightedTable<() => Item>([
    [1, potionOfHaste],
    [1, potionOfHealing],
    [1, potionOfMight],
    [1, potionOfProtection],
    [1, potionOfSlaying],
    [1, roguesBrew],
    [1, potionOfVigor],
    [1, unidentifiedPotion],
  ])()
}
