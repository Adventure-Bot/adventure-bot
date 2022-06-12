import { Stat } from '@adventure-bot/game/character'
import { ReduxState } from '@adventure-bot/game/store'
import { selectCharacterEffects } from '@adventure-bot/game/store/selectors'

export const selectStatusEffectStatModifier = (
  state: ReduxState,
  characterId: string,
  stat: Stat
): number =>
  selectCharacterEffects(state, characterId).reduce(
    (acc, effect) => acc + (effect.modifiers?.[stat] || 0),
    0
  )
