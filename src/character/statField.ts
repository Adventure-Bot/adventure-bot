import { APIEmbedField } from 'discord-api-types'
import { CommandInteraction } from 'discord.js'

import { Character } from '@adventure-bot/character'
import { Stat, statTitles } from '@adventure-bot/character/Stats'
import { statText } from '@adventure-bot/commands/statText'

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
