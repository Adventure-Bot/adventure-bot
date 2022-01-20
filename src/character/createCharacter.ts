import { randomUUID } from 'crypto'
import store from '../store'
import { created } from '../store/slices/characters'
import { Character } from './Character'
import { defaultCharacter } from './defaultCharacter'

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
