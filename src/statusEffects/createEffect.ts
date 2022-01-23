import { StatusEffect } from '@adventure-bot/statusEffects'
import { EffectTemplate, effects } from '@adventure-bot/statusEffects'

export const createEffect = (effect: EffectTemplate): StatusEffect => ({
  ...effects[effect],
  started: new Date().toString(),
})
