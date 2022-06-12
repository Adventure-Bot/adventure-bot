import { keys } from 'remeda'

import { isStatusEffectExpired } from '@adventure-bot/game/statusEffects'
import { StatusEffect } from '@adventure-bot/game/statusEffects/StatusEffect'
import { ReduxState } from '@adventure-bot/game/store'

export function selectCharacterEffects(
  { statusEffects: { effectsByCharacterId, effectsById } }: ReduxState,
  characterId: string
): StatusEffect[] {
  return keys(effectsByCharacterId[characterId] || [])
    .map((id) => effectsById[id])
    .filter((effect) => !isStatusEffectExpired(effect))
}
