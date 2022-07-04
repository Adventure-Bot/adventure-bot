import { awardXP } from '@adventure-bot/game/character'
import { createEffect } from '@adventure-bot/game/statusEffects'
import store from '@adventure-bot/game/store'
import { trapAttacked } from '@adventure-bot/game/store/actions'
import { CharacterWithStats } from '@adventure-bot/game/store/selectors'
import { effectAdded } from '@adventure-bot/game/store/slices/statusEffects'
import { TrapAttackResult } from '@adventure-bot/game/trap'
import { Trap } from '@adventure-bot/game/trap/Trap'
import { d, d20 } from '@adventure-bot/game/utils'

export function trapAttack({
  defender,
  trap,
  messageId,
}: {
  defender: CharacterWithStats
  trap: Trap
  messageId: string
}): TrapAttackResult {
  const attackRoll = d20()
  const { attackBonus, damageMax } = trap
  const damage = damageMax ? d(damageMax) : 0

  const outcome =
    attackRoll + attackBonus > defender.statsModified.ac ? 'hit' : 'miss'

  const result: TrapAttackResult = {
    outcome,
    attackRoll,
    attackBonus,
    damage,
    defender,
    trap,
  }
  store.dispatch(trapAttacked({ result, messageId }))

  if ('hit' === outcome && trap.onHitEffect)
    store.dispatch(
      effectAdded({
        characterId: defender.id,
        effect: createEffect(trap.onHitEffect),
        messageId,
      })
    )

  awardXP({
    characterId: defender.id,
    amount: 'hit' === outcome ? 1 : 2,
    messageId,
  })

  return result
}
