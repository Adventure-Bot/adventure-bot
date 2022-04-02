import { getCharacter } from '@adventure-bot/game/character'
import store from '@adventure-bot/game/store'
import { damaged } from '@adventure-bot/game/store/slices/characters'
import { TrapResult } from '@adventure-bot/game/trap'
import { d6, d20 } from '@adventure-bot/game/utils'

export const trapAttack = (
  characterId: string,
  attackBonus = 1
): TrapResult | void => {
  const defender = getCharacter(characterId)
  if (!defender) return
  const attackRoll = d20()
  const damage = d6()

  if (attackRoll + attackBonus > defender.statsModified.ac) {
    store.dispatch(
      damaged({
        characterId,
        amount: damage,
      })
    )
    return { outcome: 'hit', attackRoll, attackBonus, damage, defender }
  }
  return { outcome: 'miss', attackRoll, attackBonus, damage, defender }
}
