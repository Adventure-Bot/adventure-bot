import { values } from 'remeda'

import { Character, equipmentFilter } from '@adventure-bot/game/character'
import { Item } from '@adventure-bot/game/equipment'

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
