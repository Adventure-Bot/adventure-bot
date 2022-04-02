import { AttackResult } from '@adventure-bot/game/attack'
import { getCharacter } from '@adventure-bot/game/character'
import store from '@adventure-bot/game/store'
import { selectEncounterById } from '@adventure-bot/game/store/selectors'
import { attacked, damaged } from '@adventure-bot/game/store/slices/characters'
import { d, d20 } from '@adventure-bot/game/utils'

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

  const {
    attackBonus,
    damageBonus,
    damageMax,
    monsterDamageMax,
    dragonSlaying,
  } = attacker.statsModified

  const attackRoll = d20()
  const damageRoll = Math.ceil(Math.random() * damageMax)
  const monsterDamageRoll = defender.isMonster ? d(monsterDamageMax) : 0

  const dragonSlayingRoll = d(dragonSlaying)

  const totalDamage =
    damageRoll + monsterDamageRoll + dragonSlayingRoll + damageBonus
  const hit = attackRoll + attackBonus >= defender.statsModified.ac

  const attackResult: AttackResult = {
    outcome: hit ? 'hit' : 'miss',
    attackRoll,
    damage: totalDamage,
    damageBonus,
    damageRoll,
    monsterDamageRoll,
    dragonSlayingRoll,
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
