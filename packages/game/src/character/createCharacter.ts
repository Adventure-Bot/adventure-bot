import { randomUUID } from 'crypto'

import { Character, defaultCharacter } from '@adventure-bot/character'
import store from '@adventure-bot/store'
import { created } from '@adventure-bot/store/slices/characters'

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
