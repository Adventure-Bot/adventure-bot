import { ReduxState } from '@adventure-bot/game/store'
import { selectCharacterEffects } from '@adventure-bot/game/store/selectors'

export const selectIsHealer = (
  state: ReduxState,
  characterId: string
): boolean =>
  selectCharacterEffects(state, characterId).some(
    (effect) => effect.name === 'Healer'
  )
