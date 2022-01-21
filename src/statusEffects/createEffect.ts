import { StatusEffect } from '@adventure-bot/statusEffects/StatusEffect'
import { EffectTemplate, effects } from '@adventure-bot/statusEffects/templates'

export const createEffect = (effect: EffectTemplate): StatusEffect => ({
  ...effects[effect],
  started: new Date().toString(),
})
