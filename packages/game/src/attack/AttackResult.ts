import { SelectedCharacter } from '@adventure-bot/game/store/selectors'

export type AttackResult = {
  outcome: 'miss' | 'hit'
  attacker: SelectedCharacter
  defender: SelectedCharacter
  attackRoll: number
  damage: number
  monsterDamageRoll: number
  dragonSlayingRoll?: number
  damageRoll: number
  damageBonus: number
}
