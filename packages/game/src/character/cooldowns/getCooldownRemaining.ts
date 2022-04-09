import { Character } from '@adventure-bot/game/character'
import store from '@adventure-bot/game/store'
import {
  selectCharacterById,
  selectCooldownByType,
} from '@adventure-bot/game/store/selectors'

export const getCooldownRemaining = (
  characterId: string,
  type: keyof Character['cooldowns']
): number | void => {
  const state = store.getState()
  const character = selectCharacterById(state, characterId)
  if (!character) return
  const haste = Math.min(50, 1 - (character.stats.haste ?? 0) / 100)
  try {
    const cooldown = (selectCooldownByType(state, type) ?? 5 * 60000) * haste
    const lastUsed = selectCharacterById(state, characterId)?.cooldowns[type]
    if (!lastUsed) return 0
    const remaining = new Date(lastUsed).valueOf() + cooldown - Date.now()
    if (remaining < 0) return 0
    return remaining
  } catch (e) {
    console.error(`failed to getCooldownRemaining for user ${characterId}`, e)
    return 0
  }
}
