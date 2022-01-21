import { Character } from '@adventure-bot/character/Character'
import { getEquipmentStatModifier } from '@adventure-bot/character/getEquipmentStatModifier'
import { getStatusEffectStatModifier } from '@adventure-bot/character/getStatusEffectStatModifier'
import { Stat } from '@adventure-bot/character/Stats'

export const getCharacterStatModifier = (
  character: Character,
  stat: Stat
): number =>
  getStatusEffectStatModifier(character, stat) +
  getEquipmentStatModifier(character, stat)
