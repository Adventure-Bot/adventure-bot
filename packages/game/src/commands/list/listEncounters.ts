import { CommandInteraction, MessageEmbed } from 'discord.js'

import { encounterSummaryEmbed, getEncounters } from '@adventure-bot/encounters'

export function listEncounters(interaction: CommandInteraction): void {
  const encounters = getEncounters()
  interaction.editReply({
    embeds:
      encounters.length > 0
        ? encounters
            .map((encounter) =>
              encounterSummaryEmbed({ encounter, interaction })
            )
            .slice(0, 10)
        : [
            new MessageEmbed({
              description: 'No encounters yet. `/adventure` to find some!',
            }),
          ],
  })
}
