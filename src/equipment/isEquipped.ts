import { Item } from '@adventure-bot/equipment/Item'
import { equipmentFilter } from '@adventure-bot/character/loot/loot'
import { values } from 'remeda'
import { Character } from '@adventure-bot/character/Character'

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
