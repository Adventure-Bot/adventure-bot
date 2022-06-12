import { keys } from 'remeda'

import { StatusEffect } from '@adventure-bot/game/statusEffects/StatusEffect'
import store from '@adventure-bot/game/store'

export function selectCharacterEffects(characterId: string): StatusEffect[] {
  const { effectsByCharacterId, effectsById } = store.getState().statusEffects
  return keys(effectsByCharacterId[characterId] || []).map(
    (id) => effectsById[id]
  )
}
