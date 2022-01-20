import { isCharacterOnCooldown } from '../character/isCharacterOnCooldown'
import { getCharacter } from '../character/getCharacter'
import { startCooldown } from '../character/startCooldown'
import { d6 } from '../utils/dice'
import { HealResult } from './HealResult'
import store from '../store'
import { healed } from '../store/slices/characters'

export const heal = (
  initiatorId: string,
  targetId: string
): HealResult | undefined => {
  if (isCharacterOnCooldown(initiatorId, 'heal')) return { outcome: 'cooldown' }
  const healer = getCharacter(initiatorId)
  if (!healer) return
  const targetBeforeHeal = getCharacter(targetId)
  if (!targetBeforeHeal) return
  startCooldown({ characterId: healer.id, cooldown: 'heal' })
  const rawHeal = d6()
  store.dispatch(
    healed({
      characterId: targetId,
      amount: rawHeal,
    })
  )
  const target = getCharacter(targetId)
  if (!target) return
  return {
    outcome: 'healed',
    amount: target.hp - targetBeforeHeal.hp,
    rawHeal,
    target,
  }
}
