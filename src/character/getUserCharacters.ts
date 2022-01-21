import { Character } from '@adventure-bot/character/Character'
import store from '@adventure-bot/store'
import { selectAllCharacters } from '@adventure-bot/store/selectors'

export const getUserCharacters = (): Character[] =>
  selectAllCharacters(store.getState())
