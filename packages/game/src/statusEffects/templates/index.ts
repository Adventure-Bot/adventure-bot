import { aggression } from '@adventure-bot/statusEffects/templates/aggression'
import { frailty } from '@adventure-bot/statusEffects/templates/frailty'
import { invigorated } from '@adventure-bot/statusEffects/templates/invigorated'
import { might } from '@adventure-bot/statusEffects/templates/might'
import { protectedEffect } from '@adventure-bot/statusEffects/templates/protectedEffect'
import { slayer } from '@adventure-bot/statusEffects/templates/slayer'

export const effects = {
  invigorated,
  frailty,
  slayer,
  aggression,
  protectedEffect,
  might,
} as const

export type EffectTemplate = keyof typeof effects
