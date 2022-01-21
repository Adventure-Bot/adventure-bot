import { AttackResult } from '@adventure-bot/attack/AttackResult'
import { makeAttack } from '@adventure-bot/attack/makeAttack'
import { isCharacterOnCooldown } from '@adventure-bot/character/isCharacterOnCooldown'
import { startCooldown } from '@adventure-bot/character/startCooldown'

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
