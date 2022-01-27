import { CommandInteraction, MessageEmbed } from 'discord.js'

import { Character, statField, stats } from '@adventure-bot/character'

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
