import { AttackResult } from '@adventure-bot/attack'
import { getCharacter } from '@adventure-bot/character/getCharacter'
import store from '@adventure-bot/store'
import { selectEncounterById } from '@adventure-bot/store/selectors'
import { attacked, damaged } from '@adventure-bot/store/slices/characters'
import { d20 } from '@adventure-bot/utils/dice'

export const makeAttack = (
  attackerId: string,
  defenderId: string,
  encounterId?: string
): AttackResult | void => {
  const attacker = getCharacter(attackerId)
  const defender = getCharacter(defenderId)
  if (!attacker || !defender) return
  const encounter = encounterId
    ? selectEncounterById(store.getState(), encounterId)
    : undefined

  const { attackBonus, damageBonus, damageMax, monsterDamageMax, ac } =
    attacker.statsModified

  const targetDefense = ac

  const attackRoll = d20()
  const damageRoll = Math.ceil(Math.random() * damageMax)
  const monsterDamageRoll = defender.isMonster
    ? Math.ceil(Math.random() * monsterDamageMax)
    : 0

  const totalDamage = damageRoll + monsterDamageRoll + damageBonus
  const hit = attackRoll + attackBonus >= targetDefense

  const attackResult: AttackResult = {
    outcome: hit ? 'hit' : 'miss',
    attackRoll,
    damage: totalDamage,
    damageBonus,
    damageRoll,
    monsterDamageRoll,
    attacker,
    defender,
  }
  store.dispatch(
    attacked({
      attackResult,
      encounter,
    })
  )

  if (hit) {
    store.dispatch(
      damaged({
        characterId: defenderId,
        amount: totalDamage,
      })
    )
  }

  return attackResult
}
