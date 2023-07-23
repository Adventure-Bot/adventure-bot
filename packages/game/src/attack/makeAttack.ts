import { CommandInteraction } from 'discord.js'

import { AttackResult } from '@adventure-bot/game/attack'
import { updateQuestProgess } from '@adventure-bot/game/quest/updateQuestProgess'
import { createEffect } from '@adventure-bot/game/statusEffects'
import store from '@adventure-bot/game/store'
import {
  CharacterWithStats,
  MonsterWithStats,
  selectCharacterEffects,
  selectEncounterById,
} from '@adventure-bot/game/store/selectors'
import {
  attacked,
  damaged,
  goldStolen,
} from '@adventure-bot/game/store/slices/characters'
import {
  effectAdded,
  effectRemoved,
} from '@adventure-bot/game/store/slices/statusEffects'
import { d, d20, randomArrayElement } from '@adventure-bot/game/utils'

export function makeAttack({
  interaction,
  attacker,
  defender,
  encounterId,
}: {
  interaction: CommandInteraction
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
      updateQuestProgess({
        interaction,
        characterId: defender.id,
        questId: 'survivor',
        amount: totalDamage,
      })
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
    if (attacker.statsModified.cleansing > d(100)) {
      const debuff = randomArrayElement(
        selectCharacterEffects(store.getState(), attacker.id).filter(
          (effect) => effect.debuff
        )
      )
      if (debuff) {
        store.dispatch(effectRemoved({ character: attacker, effect: debuff }))
      }
    }
    if (attacker.equipment.weapon?.onHitEffect)
      store.dispatch(
        effectAdded({
          interaction,
          character: defender,
          effect: createEffect(attacker.equipment.weapon.onHitEffect),
        })
      )
  }

  return attackResult
}
