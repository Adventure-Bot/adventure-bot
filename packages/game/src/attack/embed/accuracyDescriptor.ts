import { playerAttack } from '@adventure-bot/game/attack'
import {
  getCharacterStatModified,
  mentionCharacter,
} from '@adventure-bot/game/character'
import { randomArrayElement } from '@adventure-bot/game/utils'

import { defaultAccuracyDescriptors } from '../../commands/attack'

export const accuracyDescriptor = (
  result: ReturnType<typeof playerAttack>
): string => {
  if (!result) return `No result`
  if (result.outcome === 'cooldown') return 'On cooldown'
  const accuracy =
    result.attackRoll +
    getCharacterStatModified(result.attacker, 'attackBonus') -
    getCharacterStatModified(result.defender, 'ac')
  const attacker = mentionCharacter(result.attacker)
  const defender = mentionCharacter(result.defender)
  const descriptors =
    result.attacker.equipment.weapon?.accuracyDescriptors ??
    defaultAccuracyDescriptors

  const descriptor =
    accuracy > 5
      ? descriptors.veryAccurate
      : accuracy > 0
      ? descriptors.onTheNose
      : accuracy > -2
      ? descriptors.nearMiss
      : descriptors.wideMiss

  return randomArrayElement(descriptor)
    .replace(/<@attacker>/g, attacker)
    .replace(/<@defender>/g, defender)
}
