import store from '@adventure-bot/game/store'
import { SelectedCharacter } from '@adventure-bot/game/store/selectors'
import { damaged } from '@adventure-bot/game/store/slices/characters'
import { TrapAttackResult } from '@adventure-bot/game/trap'
import { d6, d20 } from '@adventure-bot/game/utils'

export const trapAttack = (
  defender: SelectedCharacter,
  attackBonus = 1
): TrapAttackResult => {
  const attackRoll = d20()
  const damage = d6()

  if (attackRoll + attackBonus > defender.statsModified.ac) {
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
