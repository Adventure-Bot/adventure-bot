import { AttackResult, makeAttack } from '@adventure-bot/game/attack'
import {
  isCharacterOnCooldown,
  startCooldown,
} from '@adventure-bot/game/character'

export const playerAttack = (
  attackerId: string,
  defenderId: string
): AttackResult | { outcome: 'cooldown' } | void => {
  if (isCharacterOnCooldown(attackerId, 'attack')) {
    return { outcome: 'cooldown' }
  }
  const result = makeAttack(attackerId, defenderId)
  if (!result) return
  startCooldown({ characterId: attackerId, cooldown: 'attack' })
  return result
}
