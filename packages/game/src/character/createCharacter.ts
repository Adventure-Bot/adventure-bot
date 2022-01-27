import { randomUUID } from 'crypto'

import { Character, defaultCharacter } from '@adventure-bot/game/character'
import store from '@adventure-bot/game/store'
import { created } from '@adventure-bot/game/store/slices/characters'

export const createCharacter = (
  character: Partial<Character> & { name: string }
): Character => {
  const newCharacter: Character = {
    ...defaultCharacter,
    id: character?.id ?? randomUUID(),
    ...character,
  }
  store.dispatch(created(newCharacter))
  console.log(`created ${newCharacter.id}`)
  return newCharacter
}
