import { Character, Stats, stats } from '@adventure-bot/game/character'
import { ReduxState } from '@adventure-bot/game/store'
import { selectCharacterStatModifier } from '@adventure-bot/game/store/selectors'

export function selectCharacterStats(
  state: ReduxState,
  character: Character,
  includeModifiers = true
): Stats {
  return stats.reduce(
    (acc, stat) => ({
      ...acc,
      [stat]:
        (character[stat] ?? 0) +
        (includeModifiers
          ? selectCharacterStatModifier(state, character.id, stat)
          : 0),
    }),
    {} as Stats
  )
}
