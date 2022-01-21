import { Character } from '@adventure-bot/character/Character'
import { Usable, isUsable } from '@adventure-bot/equipment/equipment'

export function usableInventory(character: Character): Usable[] {
  return character.inventory.filter(isUsable)
}
