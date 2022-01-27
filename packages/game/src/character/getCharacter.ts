import store from '@adventure-bot/store'
import { selectCharacterById } from '@adventure-bot/store/selectors'

export const getCharacter = (
  characterId: string
): ReturnType<typeof selectCharacterById> | void =>
  selectCharacterById(store.getState(), characterId)
