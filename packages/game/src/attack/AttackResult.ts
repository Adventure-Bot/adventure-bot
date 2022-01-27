import { Character } from '@adventure-bot/game/character'

export type AttackResult = {
  outcome: 'miss' | 'hit'
  attacker: Character
  defender: Character
  attackRoll: number
  damage: number
  monsterDamageRoll: number
  damageRoll: number
  damageBonus: number
}
