import { CommandInteraction, MessageEmbed } from 'discord.js'

import { Character } from '@adventure-bot/character'
import { stats } from '@adventure-bot/character/Stats'
import { statField } from '@adventure-bot/character/statField'

export function statsEmbed({
  character,
  interaction,
}: {
  character: Character
  interaction: CommandInteraction
}): MessageEmbed {
  return new MessageEmbed({
    title: `Stats`,
    fields: stats.map((stat) => statField(character, interaction, stat)),
  })
}
