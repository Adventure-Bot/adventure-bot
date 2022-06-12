import { effects, isAppliedEffect } from '@adventure-bot/game/statusEffects'
import { CharacterWithStats } from '@adventure-bot/game/store/selectors'
import { selectCharacterEffects } from '@adventure-bot/game/store/selectors'

export function stunDurationRemaining(character: CharacterWithStats): number {
  const stunned = selectCharacterEffects(character.id)
    .filter((effect) => effect.name === effects.stunned.name)
    .filter(isAppliedEffect)
    .sort((a, b) => (a.started < b.started ? 1 : -1))[0]
  if (!stunned || !stunned.started || !stunned.duration) return 0
  return Date.now() - new Date(stunned.started).valueOf() + stunned.duration
}
