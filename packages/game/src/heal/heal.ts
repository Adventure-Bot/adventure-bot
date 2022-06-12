import {
  getCharacter,
  isCharacterOnCooldown,
  startCooldown,
} from '@adventure-bot/game/character'
import { HealResult } from '@adventure-bot/game/heal/HealResult'
import { selectIsHealer } from '@adventure-bot/game/heal/isHealer'
import store from '@adventure-bot/game/store'
import { healed } from '@adventure-bot/game/store/slices/characters'
import { d6 } from '@adventure-bot/game/utils'

export function heal({
  healerId,
  targetId,
}: {
  healerId: string
  targetId: string
}): HealResult | undefined {
  const state = store.getState()
  if (isCharacterOnCooldown(healerId, 'heal')) return { outcome: 'cooldown' }
  const healer = getCharacter(healerId)
  if (!healer) return
  const targetBeforeHeal = getCharacter(targetId)
  if (!targetBeforeHeal) return
  startCooldown({ characterId: healer.id, cooldown: 'heal' })
  const rawHeal = d6() + (selectIsHealer(state, healer.id) ? 2 : 0)
  store.dispatch(
    healed({
      character: targetBeforeHeal,
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
