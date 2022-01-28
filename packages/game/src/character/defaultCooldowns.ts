import { Character } from '@adventure-bot/game/character'

export const defaultCooldowns: {
  [key in keyof Character['cooldowns']]: number
} = {
  renew: 60 * 60000,
  adventure: 5 * 60000,
  attack: 5 * 60000,
  heal: 5 * 60000,
}
