import { getCharacter } from './character/getCharacter'
import store from '@adventure-bot/store'
import { grantDivineBlessing as doGrantDivineBlessing } from '@adventure-bot/store/slices/characters'

export const grantDivineBlessing = (characterId: string): void => {
  const character = getCharacter(characterId)
  if (!character) return
  store.dispatch(doGrantDivineBlessing(character))
}
