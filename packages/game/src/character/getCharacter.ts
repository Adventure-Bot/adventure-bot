import store from '@adventure-bot/game/store'
import { selectCharacterById } from '@adventure-bot/game/store/selectors'

export function getCharacter(
  characterId: string
): ReturnType<typeof selectCharacterById> | void {
  return selectCharacterById(store.getState(), characterId)
}
