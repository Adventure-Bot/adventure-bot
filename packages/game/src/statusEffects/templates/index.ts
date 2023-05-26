import { aggression } from '@adventure-bot/game/statusEffects/templates/aggression'
import { blessed } from '@adventure-bot/game/statusEffects/templates/blessed'
import { blind } from '@adventure-bot/game/statusEffects/templates/blind'
import { frailty } from '@adventure-bot/game/statusEffects/templates/frailty'
import { haste } from '@adventure-bot/game/statusEffects/templates/haste'
import { healer } from '@adventure-bot/game/statusEffects/templates/healer'
import { invigorated } from '@adventure-bot/game/statusEffects/templates/invigorated'
import { might } from '@adventure-bot/game/statusEffects/templates/might'
import { poisoned } from '@adventure-bot/game/statusEffects/templates/poisoned'
import { protectedEffect } from '@adventure-bot/game/statusEffects/templates/protectedEffect'
import { rogue } from '@adventure-bot/game/statusEffects/templates/rogue'
import { rugged } from '@adventure-bot/game/statusEffects/templates/rugged'
import { slayer } from '@adventure-bot/game/statusEffects/templates/slayer'
import { slowed } from '@adventure-bot/game/statusEffects/templates/slowed'
import { stunned } from '@adventure-bot/game/statusEffects/templates/stunned'
import { survivor } from '@adventure-bot/game/statusEffects/templates/survivor'

export const effects = {
  aggression,
  blessed,
  blind,
  frailty,
  haste,
  healer,
  invigorated,
  might,
  poisoned,
  protectedEffect,
  rogue,
  rugged,
  slayer,
  slowed,
  stunned,
  survivor,
} as const

export type EffectId = keyof typeof effects
