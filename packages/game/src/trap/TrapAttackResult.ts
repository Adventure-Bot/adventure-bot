import { StatusEffect } from '@adventure-bot/game/statusEffects'
import { SelectedCharacter } from '@adventure-bot/game/store/selectors'
import { Trap } from '@adventure-bot/game/trap/Trap'

export type TrapAttackResult = {
  outcome: 'hit' | 'miss'
  attackRoll: number
  attackBonus: number
  damage: number
  defender: SelectedCharacter
  effect?: StatusEffect
  trap: Trap
}
