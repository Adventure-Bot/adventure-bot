import { Equippable, isEquippable } from '@adventure-bot/equipment/equipment'
import { isEquipped } from '@adventure-bot/equipment/isEquipped'
import { Character } from '@adventure-bot/character/Character'

export function equippableInventory(character: Character): Equippable[] {
  return character.inventory
    .filter(isEquippable)
    .filter((item) => !isEquipped({ character, item }))
}
