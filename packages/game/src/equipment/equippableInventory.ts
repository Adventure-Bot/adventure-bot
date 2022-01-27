import { Character } from '@adventure-bot/game/character'
import {
  Equippable,
  isEquippable,
  isEquipped,
} from '@adventure-bot/game/equipment'

export function equippableInventory(character: Character): Equippable[] {
  return character.inventory
    .filter(isEquippable)
    .filter((item) => !isEquipped({ character, item }))
}
