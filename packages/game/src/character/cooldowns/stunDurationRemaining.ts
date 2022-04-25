import { effects } from '@adventure-bot/game/statusEffects'
import { CharacterWithStats } from '@adventure-bot/game/store/selectors'

export function stunDurationRemaining(character: CharacterWithStats): number {
  const stunned = character.statusEffects
    .filter((effect) => effect.name === effects.stunned.name)
    .sort((a, b) => (a.started < b.started ? 1 : -1))[0]
  if (!stunned) return 0
  return Date.now() - new Date(stunned.started).valueOf() + stunned.duration
}
