import { AttackResult } from '@adventure-bot/game/attack'
import { updateQuestProgess } from '@adventure-bot/game/quest/updateQuestProgess'
import { createEffect } from '@adventure-bot/game/statusEffects'
import store from '@adventure-bot/game/store'
import {
  CharacterWithStats,
  MonsterWithStats,
  selectEncounterById,
} from '@adventure-bot/game/store/selectors'
import {
  attacked,
  damaged,
  goldStolen,
} from '@adventure-bot/game/store/slices/characters'
import { effectAdded } from '@adventure-bot/game/store/slices/statusEffects'
import { d, d20 } from '@adventure-bot/game/utils'

export function makeAttack({
  attacker,
  defender,
  encounterId,
}: {
  attacker: CharacterWithStats
  defender: CharacterWithStats | MonsterWithStats
  encounterId?: string
}): AttackResult {
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
        character: defender,
        amount: totalDamage,
      })
    )
    if (totalDamage < defender.hp)
      updateQuestProgess(defender.id, 'survivor', totalDamage)
    if (attacker.pickpocket) {
      const amount = Math.min(defender.gold, d(attacker.pickpocket))
      store.dispatch(
        goldStolen({
          attackerId: attacker.id,
          defenderId: defender.id,
          amount,
        })
      )
    }
    if (attacker.equipment.weapon?.onHitEffect)
      store.dispatch(
        effectAdded({
          character: defender,
          effect: createEffect(attacker.equipment.weapon.onHitEffect),
        })
      )
  }

  return attackResult
}
