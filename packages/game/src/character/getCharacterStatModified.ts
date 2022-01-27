import {
  Character,
  Stat,
  getCharacterStatModifier,
} from '@adventure-bot/game/character'

export const getCharacterStatModified = (
  character: Character,
  stat: Stat
): number => {
  if (stat === 'damageMax')
    return character.equipment.weapon?.damageMax ?? character.damageMax
  return character[stat] + getCharacterStatModifier(character, stat)
}
