import store from '@adventure-bot/game/store'
import { SelectedCharacter } from '@adventure-bot/game/store/selectors'
import { damaged } from '@adventure-bot/game/store/slices/characters'
import { TrapAttackResult } from '@adventure-bot/game/trap'
import { Trap } from '@adventure-bot/game/trap/Trap'
import { d, d20 } from '@adventure-bot/game/utils'

export function trapAttack({
  defender,
  trap,
}: {
  defender: SelectedCharacter
  trap: Trap
}): TrapAttackResult {
  const attackRoll = d20()
  const { attackBonus, damageMax } = trap
  const damage = damageMax ? d(damageMax) : 0

  if (damage && attackRoll + attackBonus > defender.statsModified.ac) {
    store.dispatch(
      damaged({
        characterId: defender.id,
        amount: damage,
      })
    )
    return { outcome: 'hit', attackRoll, attackBonus, damage, defender }
  }
  return { outcome: 'miss', attackRoll, attackBonus, damage, defender }
}
