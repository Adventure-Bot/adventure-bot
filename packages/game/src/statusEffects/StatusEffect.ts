import { Stats } from '@adventure-bot/game/character'

export type StatusEffect = {
  name: string
  // image: string; // TODO
  started: string // TODO: change to number and use Date.valueOf()
  /**
   * Duration in milliseconds
   */
  duration: number
  modifiers?: Partial<Stats>
  buff: boolean
  debuff: boolean
  announcement: string
}
