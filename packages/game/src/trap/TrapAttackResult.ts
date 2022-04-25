import { StatusEffect } from '@adventure-bot/game/statusEffects'
import { CharacterWithStats } from '@adventure-bot/game/store/selectors'
import { Trap } from '@adventure-bot/game/trap/Trap'

export type TrapAttackResult = {
  outcome: 'hit' | 'miss'
  attackRoll: number
  attackBonus: number
  damage: number
  defender: CharacterWithStats
  effect?: StatusEffect
  trap: Trap
}
