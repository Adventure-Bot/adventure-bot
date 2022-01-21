import store from '@adventure-bot/store'
import { selectAllCharacters } from '@adventure-bot/store/selectors'
import { Character } from '@adventure-bot/character/Character'

export const getUserCharacters = (): Character[] =>
  selectAllCharacters(store.getState())
