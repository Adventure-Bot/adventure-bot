import { values } from 'remeda'

import { Character } from '@adventure-bot/character/Character'
import { equipmentFilter } from '@adventure-bot/character/loot/loot'
import { Item } from '@adventure-bot/equipment/Item'

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
