import { CommandInteraction } from 'discord.js'

import {
  getCharacter,
  isCharacterOnCooldown,
  startCooldown,
} from '@adventure-bot/game/character'
import { HealResult } from '@adventure-bot/game/heal/HealResult'
import store from '@adventure-bot/game/store'
import { selectIsHealer } from '@adventure-bot/game/store/selectors'
import { healed } from '@adventure-bot/game/store/slices/characters'
import { d6 } from '@adventure-bot/game/utils'

export function healAbility({
  healerId,
  targetId,
  interaction,
}: {
  healerId: string
  targetId: string
  interaction: CommandInteraction
}): HealResult | undefined {
  const state = store.getState()
  if (isCharacterOnCooldown(healerId, 'heal')) return { outcome: 'cooldown' }

  const healer = getCharacter(healerId)
  if (!healer) return

  const targetBeforeHeal = getCharacter(targetId)
  if (!targetBeforeHeal) return

  if (targetBeforeHeal.hp >= targetBeforeHeal.statsModified.maxHP)
    return { outcome: 'full' }

  startCooldown({ characterId: healer.id, cooldown: 'heal', interaction })
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
