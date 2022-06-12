import { ColorResolvable } from 'discord.js'

import { Stats } from '@adventure-bot/game/character'

export type StatusEffect = {
  name: string
  // image: string; // TODO
  started?: string // TODO: change to number and use Date.valueOf()
  /**
   * Duration in milliseconds
   */
  duration: number
  modifiers?: Partial<Stats>
  buff: boolean
  debuff: boolean
  announcement: string
  announcementColor: Exclude<ColorResolvable, readonly [number, number, number]>
}

export type PeriodicEffect = StatusEffect & {
  overTime: {
    healthAdjustment?: number
    ticksRemaining: number
  }
}

export type AppliedEffect = StatusEffect & {
  started: string
}

export const isAppliedEffect = (
  effect: StatusEffect
): effect is AppliedEffect => !!effect.started
