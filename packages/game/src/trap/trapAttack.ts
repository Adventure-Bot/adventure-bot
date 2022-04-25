import store from '@adventure-bot/game/store'
import { trapAttacked } from '@adventure-bot/game/store/actions'
import { CharacterWithStats } from '@adventure-bot/game/store/selectors'
import { TrapAttackResult } from '@adventure-bot/game/trap'
import { Trap } from '@adventure-bot/game/trap/Trap'
import { d, d20 } from '@adventure-bot/game/utils'

export function trapAttack({
  defender,
  trap,
}: {
  defender: CharacterWithStats
  trap: Trap
}): TrapAttackResult {
  const attackRoll = d20()
  const { attackBonus, damageMax } = trap
  const damage = damageMax ? d(damageMax) : 0

  const result: TrapAttackResult = {
    outcome:
      attackRoll + attackBonus > defender.statsModified.ac ? 'hit' : 'miss',
    attackRoll,
    attackBonus,
    damage,
    defender,
    trap,
  }
  store.dispatch(
    trapAttacked({
      outcome:
        attackRoll + attackBonus > defender.statsModified.ac ? 'hit' : 'miss',
      attackRoll,
      attackBonus,
      damage,
      defender,
      trap,
    })
  )

  return result
}
