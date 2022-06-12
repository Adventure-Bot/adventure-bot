import { randomUUID } from 'crypto'

import { StatusEffect } from '@adventure-bot/game/statusEffects'
import { EffectId, effects } from '@adventure-bot/game/statusEffects'

export const createEffect = (effect: EffectId): StatusEffect => ({
  ...effects[effect],
  id: randomUUID(),
  started: new Date().toString(),
})
