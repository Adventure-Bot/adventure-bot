import { Character } from '@adventure-bot/game/character'
import { Usable, isUsable } from '@adventure-bot/game/equipment'

export function usableInventory(character: Character): Usable[] {
  return character.inventory.filter(isUsable)
}
