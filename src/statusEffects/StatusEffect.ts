import { Stats } from '@adventure-bot/character/Stats'

export type StatusEffect = {
  name: string
  // image: string; // TODO
  started: string
  /**
   * Duration in milliseconds
   */
  duration: number
  modifiers: Partial<Stats>
  buff: boolean
  debuff: boolean
}
