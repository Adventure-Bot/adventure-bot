import { StatusEffect } from '@adventure-bot/game/statusEffects'
import { SelectedCharacter } from '@adventure-bot/game/store/selectors'

export type TrapAttackResult = {
  outcome: 'hit' | 'miss'
  attackRoll: number
  attackBonus: number
  damage: number
  defender: SelectedCharacter
  effect?: StatusEffect
}
