import { CommandInteraction } from 'discord.js'

import { awardXP } from '@adventure-bot/game/character'
import { updateQuestProgess } from '@adventure-bot/game/quest'
import { createEffect } from '@adventure-bot/game/statusEffects'
import store from '@adventure-bot/game/store'
import { trapAttacked } from '@adventure-bot/game/store/actions'
import { CharacterWithStats } from '@adventure-bot/game/store/selectors'
import { damaged } from '@adventure-bot/game/store/slices/characters'
import { effectAdded } from '@adventure-bot/game/store/slices/statusEffects'
import { TrapAttackResult, TrapWithStats } from '@adventure-bot/game/trap'
import { d, d20 } from '@adventure-bot/game/utils'

export function trapAttack({
  interaction,
  defender,
  trap,
}: {
  interaction: CommandInteraction
  defender: CharacterWithStats
  trap: TrapWithStats
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
  store.dispatch(trapAttacked({ result }))

  if ('hit' === outcome && trap.onHitEffect)
    store.dispatch(
      effectAdded({
        interaction,
        character: defender,
        effect: createEffect(trap.onHitEffect),
      })
    )

  if ('hit' === outcome) {
    if (damage) {
      store.dispatch(
        damaged({
          character: defender,
          amount: damage,
        })
      )
      if (damage < defender.hp)
        updateQuestProgess({
          interaction,
          characterId: defender.id,
          questId: 'survivor',
          amount: damage,
        })
    }
  }

  awardXP({
    characterId: defender.id,
    amount: 'hit' === outcome ? 1 : 2,
  })

  return result
}
