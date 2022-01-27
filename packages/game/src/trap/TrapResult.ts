import { Character } from '@adventure-bot/game/character'

export type TrapResult = {
  outcome: 'hit' | 'miss'
  attackRoll: number
  attackBonus: number
  damage: number
  defender: Character
}
