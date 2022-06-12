import { effects } from '@adventure-bot/game/statusEffects'
import { ReduxState } from '@adventure-bot/game/store'
import { selectCharacterEffects } from '@adventure-bot/game/store/selectors'

export function selectStunDurationRemaining(
  state: ReduxState,
  characterId: string
): number {
  const stunned = selectCharacterEffects(state, characterId)
    .filter((effect) => effect.name === effects.stunned.name)
    .sort((a, b) => (a.started < b.started ? 1 : -1))[0]
  if (!stunned || !stunned.started || !stunned.duration) return 0
  return Date.now() - new Date(stunned.started).valueOf() + stunned.duration
}
