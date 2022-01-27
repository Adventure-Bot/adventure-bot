import { Character } from '@adventure-bot/game/character'
import store from '@adventure-bot/game/store'
import { selectCharacterById } from '@adventure-bot/game/store/selectors'

export const getCharacterUpdate = (character: Character): Character => {
  return selectCharacterById(store.getState(), character.id) ?? character
}
