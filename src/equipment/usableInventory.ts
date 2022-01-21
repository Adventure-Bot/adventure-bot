import { isUsable, Usable } from '@adventure-bot/equipment/equipment'
import { Character } from '@adventure-bot/character/Character'

export function usableInventory(character: Character): Usable[] {
  return character.inventory.filter(isUsable)
}
