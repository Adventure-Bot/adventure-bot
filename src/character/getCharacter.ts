import store from '../store'
import { selectCharacterById } from '../store/selectors'

export const getCharacter = (
  characterId: string
): ReturnType<typeof selectCharacterById> | void =>
  selectCharacterById(store.getState(), characterId)
