import {
  Character,
  Stat,
  getEquipmentStatModifier,
  getStatusEffectStatModifier,
} from '@adventure-bot/game/character'

export const getCharacterStatModifier = (
  character: Character,
  stat: Stat
): number =>
  getStatusEffectStatModifier(character, stat) +
  getEquipmentStatModifier(character, stat)
