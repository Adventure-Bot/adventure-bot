import { values } from 'remeda'

import { Character, equipmentFilter } from '@adventure-bot/character'
import { Item } from '@adventure-bot/equipment'

export function isEquipped({
  character,
  item,
}: {
  character: Character
  item: Item
}): boolean {
  return (
    values(equipmentFilter(character.equipment, (i) => i.id === item.id))
      .length > 0
  )
}
