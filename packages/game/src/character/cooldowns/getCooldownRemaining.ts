import moment from 'moment'
import { clamp } from 'remeda'

import {
  Character,
  abilityCooldowns,
  stunDurationRemaining,
} from '@adventure-bot/game/character'
import store from '@adventure-bot/game/store'
import { selectCharacterById } from '@adventure-bot/game/store/selectors'

export const getCooldownRemaining = (
  characterId: string,
  type: keyof Character['cooldowns']
): number | void => {
  const state = store.getState()
  const character = selectCharacterById(state, characterId)
  if (!character) return
  const haste =
    clamp(100 - character.statsModified.haste, { min: 50, max: 150 }) / 100

  const cooldownRemaining = moment(character.cooldowns[type] ?? 0)
    .add(abilityCooldowns[type] * haste, 'milliseconds')
    .diff(moment())
  return Math.max(cooldownRemaining, stunDurationRemaining(character), 0)
}
