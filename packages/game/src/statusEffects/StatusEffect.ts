import { Stats } from '@adventure-bot/game/character'

export type StatusEffect = {
  name: string
  // image: string; // TODO
  started: string
  /**
   * Duration in milliseconds
   */
  duration: number
  modifiers?: Partial<Stats>
  buff: boolean
  debuff: boolean
}
