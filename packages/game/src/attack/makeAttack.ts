import { AttackResult } from '@adventure-bot/game/attack'
import { getCharacter } from '@adventure-bot/game/character'
import { createEffect } from '@adventure-bot/game/statusEffects'
import store from '@adventure-bot/game/store'
import { selectEncounterById } from '@adventure-bot/game/store/selectors'
import { attacked, damaged } from '@adventure-bot/game/store/slices/characters'
import { effectAdded } from '@adventure-bot/game/store/slices/statusEffects'
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
  const damageRoll = d(damageMax)
  const monsterDamageRoll = defender.isMonster ? d(monsterDamageMax) : 0

  const dragonSlayingRoll = d(dragonSlaying)

  const totalDamage =
    (damageRoll + monsterDamageRoll + dragonSlayingRoll + damageBonus) *
    (attackRoll == 20 ? 2 : 1)
  const outcome =
    attackRoll === 20
      ? 'crit'
      : attackRoll + attackBonus >= defender.statsModified.ac
      ? 'hit'
      : 'miss'

  const attackResult: AttackResult = {
    outcome,
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

  if (['hit', 'crit'].includes(outcome)) {
    store.dispatch(
      damaged({
        characterId: defenderId,
        amount: totalDamage,
      })
    )
    if (attacker.equipment.weapon?.onHitEffect)
      store.dispatch(
        effectAdded({
          characterId: defenderId,
          effect: createEffect(attacker.equipment.weapon.onHitEffect),
        })
      )
  }

  return attackResult
}
