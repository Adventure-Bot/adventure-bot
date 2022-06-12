import { Stat } from '@adventure-bot/game/character'
import { ReduxState } from '@adventure-bot/game/store'

export const selectEquipmentStatModifier = (
  state: ReduxState,
  characterId: string,
  stat: Stat
): number => {
  const character = state.characters.charactersById[characterId]
  if (!character) return 0
  return Object.values(character.equipment).reduce(
    (acc, item) => acc + (item.modifiers?.[stat] ?? 0),
    0
  )
}
