import { Character } from '@adventure-bot/character'
import { Equippable, isEquippable, isEquipped } from '@adventure-bot/equipment'

export function equippableInventory(character: Character): Equippable[] {
  return character.inventory
    .filter(isEquippable)
    .filter((item) => !isEquipped({ character, item }))
}
