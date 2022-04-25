import { CharacterWithStats } from '@adventure-bot/game/store/selectors'

export type AttackResult = {
  outcome: 'miss' | 'hit' | 'crit'
  attacker: CharacterWithStats
  defender: CharacterWithStats
  attackRoll: number
  damage: number
  monsterDamageRoll: number
  dragonSlayingRoll?: number
  damageRoll: number
  damageBonus: number
}
