import { Stat } from '@adventure-bot/game/character'
import { ReduxState } from '@adventure-bot/game/store'
import {
  selectEquipmentStatModifier,
  selectStatusEffectStatModifier,
} from '@adventure-bot/game/store/selectors'

export const selectCharacterStatModifier = (
  state: ReduxState,
  characterId: string,
  stat: Stat
): number =>
  selectStatusEffectStatModifier(state, characterId, stat) +
  selectEquipmentStatModifier(state, characterId, stat)
