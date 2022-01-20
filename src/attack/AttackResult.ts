import { Character } from '../character/Character'

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
