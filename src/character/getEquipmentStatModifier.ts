import { Character } from '@adventure-bot/character/Character'
import { Item } from '@adventure-bot/equipment/Item'
import { Stat } from '@adventure-bot/character/Stats'

export const getEquipmentStatModifier = (
  character: Character,
  stat: Stat
): number =>
  Object.values(character.equipment).reduce(
    (acc, item: Item) => acc + (item.modifiers?.[stat] ?? 0),
    0
  )
