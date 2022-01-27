import { Character } from '@adventure-bot/character'

export type TrapResult = {
  outcome: 'hit' | 'miss'
  attackRoll: number
  attackBonus: number
  damage: number
  defender: Character
}
