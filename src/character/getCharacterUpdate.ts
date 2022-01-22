import { Character } from '@adventure-bot/character'
import store from '@adventure-bot/store'
import { selectCharacterById } from '@adventure-bot/store/selectors'

export const getCharacterUpdate = (character: Character): Character => {
  return selectCharacterById(store.getState(), character.id) ?? character
}
