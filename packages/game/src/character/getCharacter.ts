import store from '@adventure-bot/game/store'
import { selectCharacterById } from '@adventure-bot/game/store/selectors'

export const getCharacter = (
  characterId: string
): ReturnType<typeof selectCharacterById> | void =>
  selectCharacterById(store.getState(), characterId)
