import { APIEmbedField } from 'discord-api-types'
import { CommandInteraction } from 'discord.js'

import { Emoji } from '@adventure-bot/game/Emoji'
import {
  Character,
  Stat,
  getCharacterStatModified,
  getCharacterStatModifier,
  statTitles,
} from '@adventure-bot/game/character'

export function statField(
  character: Character,
  interaction: CommandInteraction,
  stat: Stat
): APIEmbedField {
  return {
    name: statTitles[stat],
    value: statText({ character, stat, interaction }),
    inline: true,
  }
}
function statText({
  character,
  stat,
}: {
  character: Character
  stat: Stat
  interaction: CommandInteraction
}): string {
  const modified = getCharacterStatModified(character, stat)
  const modifier = getCharacterStatModifier(character, stat)
  const sign = modifier > 0 ? '+' : ''
  return Emoji(stat) + ` ${modified}${modifier ? ` (${sign}${modifier})` : ''}`
}
