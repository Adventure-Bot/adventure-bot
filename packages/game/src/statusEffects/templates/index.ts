import { aggression } from '@adventure-bot/game/statusEffects/templates/aggression'
import { frailty } from '@adventure-bot/game/statusEffects/templates/frailty'
import { invigorated } from '@adventure-bot/game/statusEffects/templates/invigorated'
import { might } from '@adventure-bot/game/statusEffects/templates/might'
import { protectedEffect } from '@adventure-bot/game/statusEffects/templates/protectedEffect'
import { slayer } from '@adventure-bot/game/statusEffects/templates/slayer'

export const effects = {
  invigorated,
  frailty,
  slayer,
  aggression,
  protectedEffect,
  might,
} as const

export type EffectTemplate = keyof typeof effects
