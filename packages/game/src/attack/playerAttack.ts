import { AttackResult, makeAttack } from '@adventure-bot/game/attack'
import {
  isCharacterOnCooldown,
  startCooldown,
} from '@adventure-bot/game/character'
import { CharacterWithStats } from '@adventure-bot/game/store/selectors'

export function playerAttack(
  attacker: CharacterWithStats,
  defender: CharacterWithStats
): AttackResult | { outcome: 'cooldown' } {
  if (isCharacterOnCooldown(attacker.id, 'attack')) {
    return { outcome: 'cooldown' }
  }
  startCooldown({ characterId: attacker.id, cooldown: 'attack' })
  return makeAttack({
    attacker,
    defender,
  })
}
