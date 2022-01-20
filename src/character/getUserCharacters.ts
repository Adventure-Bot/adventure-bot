import store from '../store'
import { selectAllCharacters } from '../store/selectors'
import { Character } from './Character'

export const getUserCharacters = (): Character[] =>
  selectAllCharacters(store.getState())
