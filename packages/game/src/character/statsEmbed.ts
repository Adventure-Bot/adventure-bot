import { CommandInteraction, MessageEmbed } from 'discord.js'

import { statField, stats } from '@adventure-bot/game/character'
import { CharacterWithStats } from '@adventure-bot/game/store/selectors'

export function statsEmbed({
  character,
  interaction,
}: {
  character: CharacterWithStats
  interaction: CommandInteraction
}): MessageEmbed {
  return new MessageEmbed({
    title: `Stats`,
    fields: stats
      .filter((stat) => character.statsModified[stat])
      .map((stat) => statField(character, interaction, stat)),
  })
}
