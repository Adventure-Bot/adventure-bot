import { Character } from '@adventure-bot/character/Character'
import { Equippable, isEquippable } from '@adventure-bot/equipment/equipment'
import { isEquipped } from '@adventure-bot/equipment/isEquipped'

export function equippableInventory(character: Character): Equippable[] {
  return character.inventory
    .filter(isEquippable)
    .filter((item) => !isEquipped({ character, item }))
}
