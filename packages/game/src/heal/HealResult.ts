import { Character } from '@adventure-bot/game/character'

export type HealResult =
  | { outcome: 'healed'; amount: number; target: Character; rawHeal: number }
  | { outcome: 'cooldown' }
