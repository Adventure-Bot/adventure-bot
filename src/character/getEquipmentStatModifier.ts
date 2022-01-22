import { Character, Stat } from '@adventure-bot/character'
import { Item } from '@adventure-bot/equipment'

export const getEquipmentStatModifier = (
  character: Character,
  stat: Stat
): number =>
  Object.values(character.equipment).reduce(
    (acc, item: Item) => acc + (item.modifiers?.[stat] ?? 0),
    0
  )
