import { StatusEffect } from './StatusEffect'
import { EffectTemplate, effects } from './templates'

export const createEffect = (effect: EffectTemplate): StatusEffect => ({
  ...effects[effect],
  started: new Date().toString(),
})
