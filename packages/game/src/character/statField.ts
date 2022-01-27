import { APIEmbedField } from 'discord-api-types'
import { CommandInteraction } from 'discord.js'

import {
  Character,
  Stat,
  statText,
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
