import { getCharacter } from '@adventure-bot/character/getCharacter'
import { isCharacterOnCooldown } from '@adventure-bot/character/isCharacterOnCooldown'
import { startCooldown } from '@adventure-bot/character/startCooldown'
import { HealResult } from '@adventure-bot/heal/HealResult'
import store from '@adventure-bot/store'
import { healed } from '@adventure-bot/store/slices/characters'
import { d6 } from '@adventure-bot/utils/dice'

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
