import store from '../store'
import { selectCharacterById } from '../store/selectors'
import { Character } from './Character'

export const getCharacter = (characterId: string): Character | void =>
  selectCharacterById(store.getState(), characterId)
