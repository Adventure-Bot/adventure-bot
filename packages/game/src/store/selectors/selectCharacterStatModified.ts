import { Character, Stat } from '@adventure-bot/game/character'
import { ReduxState } from '@adventure-bot/game/store'
import { selectCharacterStatModifier } from '@adventure-bot/game/store/selectors'

export function selectCharacterStatModified(
  state: ReduxState,
  character: Character,
  stat: Stat
): number {
  if (stat === 'damageMax')
    return character.equipment.weapon?.damageMax ?? character.damageMax
  return (
    (character[stat] ?? 0) +
    selectCharacterStatModifier(state, character.id, stat)
  )
}
