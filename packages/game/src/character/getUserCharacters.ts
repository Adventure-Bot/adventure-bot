import { Character } from '@adventure-bot/game/character'
import store from '@adventure-bot/game/store'
import { selectAllCharacters } from '@adventure-bot/game/store/selectors'

export const getUserCharacters = (): Character[] =>
  selectAllCharacters(store.getState())
