import { Character } from '@adventure-bot/character'
import { Usable, isUsable } from '@adventure-bot/equipment'

export function usableInventory(character: Character): Usable[] {
  return character.inventory.filter(isUsable)
}
