import { aggression } from '@adventure-bot/game/statusEffects/templates/aggression'
import { blind } from '@adventure-bot/game/statusEffects/templates/blind'
import { frailty } from '@adventure-bot/game/statusEffects/templates/frailty'
import { haste } from '@adventure-bot/game/statusEffects/templates/haste'
import { invigorated } from '@adventure-bot/game/statusEffects/templates/invigorated'
import { might } from '@adventure-bot/game/statusEffects/templates/might'
import { poisoned } from '@adventure-bot/game/statusEffects/templates/poisoned'
import { protectedEffect } from '@adventure-bot/game/statusEffects/templates/protectedEffect'
import { slayer } from '@adventure-bot/game/statusEffects/templates/slayer'
import { slowed } from '@adventure-bot/game/statusEffects/templates/slowed'
import { stunned } from '@adventure-bot/game/statusEffects/templates/stunned'

export const effects = {
  aggression,
  blind,
  frailty,
  haste,
  invigorated,
  might,
  poisoned,
  protectedEffect,
  slayer,
  slowed,
  stunned,
} as const

export const defaultEffectDuration = 60 * 60000

export type EffectTemplate = keyof typeof effects
