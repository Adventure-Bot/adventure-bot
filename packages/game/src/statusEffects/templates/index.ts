import { aggression } from '@adventure-bot/game/statusEffects/templates/aggression'
import { blind } from '@adventure-bot/game/statusEffects/templates/blind'
import { frailty } from '@adventure-bot/game/statusEffects/templates/frailty'
import { haste } from '@adventure-bot/game/statusEffects/templates/haste'
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
  blind,
  haste,
} as const

export const defaultEffectDuration = 60 * 60000

export type EffectTemplate = keyof typeof effects
