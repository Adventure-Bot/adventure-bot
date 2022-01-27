import { StatusEffect } from '@adventure-bot/game/statusEffects'
import { EffectTemplate, effects } from '@adventure-bot/game/statusEffects'

export const createEffect = (effect: EffectTemplate): StatusEffect => ({
  ...effects[effect],
  started: new Date().toString(),
})
