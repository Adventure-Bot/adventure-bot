import store from '@adventure-bot/store'
import { selectAllCharacters } from '@adventure-bot/store/selectors'
import { Character } from './Character'

export const getUserCharacters = (): Character[] =>
  selectAllCharacters(store.getState())
