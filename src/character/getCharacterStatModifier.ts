import { Character } from '@adventure-bot/character/Character'
import { Stat } from '@adventure-bot/character/Stats'
import { getEquipmentStatModifier } from '@adventure-bot/character/getEquipmentStatModifier'
import { getStatusEffectStatModifier } from '@adventure-bot/character/getStatusEffectStatModifier'

export const getCharacterStatModifier = (
  character: Character,
  stat: Stat
): number =>
  getStatusEffectStatModifier(character, stat) +
  getEquipmentStatModifier(character, stat)
