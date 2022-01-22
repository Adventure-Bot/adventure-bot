import { Character } from '@adventure-bot/character'

export type HealResult =
  | { outcome: 'healed'; amount: number; target: Character; rawHeal: number }
  | { outcome: 'cooldown' }
