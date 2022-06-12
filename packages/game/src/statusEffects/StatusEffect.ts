import { ColorResolvable } from 'discord.js'

import { Stats } from '@adventure-bot/game/character'

export type EffectTemplate = {
  name: string
  // image: string; // TODO
  /**
   * Duration in milliseconds
   */
  duration: number
  modifiers?: Partial<Stats>
  buff: boolean
  debuff: boolean
  announcement: string
  announcementColor: Exclude<ColorResolvable, readonly [number, number, number]>
  healthAdjustment?: number
  ticksRemaining?: number
}

export type StatusEffect = EffectTemplate & {
  started: string
  id: string
}

export const isAppliedEffect = (effect: StatusEffect): effect is StatusEffect =>
  !!effect.started
