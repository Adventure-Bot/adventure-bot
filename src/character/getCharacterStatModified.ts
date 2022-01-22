import { Character } from '@adventure-bot/character'
import { Stat } from '@adventure-bot/character/Stats'
import { getCharacterStatModifier } from '@adventure-bot/character/getCharacterStatModifier'

export const getCharacterStatModified = (
  character: Character,
  stat: Stat
): number => {
  if (stat === 'damageMax')
    return character.equipment.weapon?.damageMax ?? character.damageMax
  return character[stat] + getCharacterStatModifier(character, stat)
}
