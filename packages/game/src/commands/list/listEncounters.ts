import { CommandInteraction, EmbedBuilder } from 'discord.js'

import {
  encounterSummaryEmbed,
  getEncounters,
} from '@adventure-bot/game/encounters'

export function listEncounters(interaction: CommandInteraction): void {
  const encounters = getEncounters()
  interaction.channel?.send({
    embeds:
      encounters.length > 0
        ? encounters
            .map((encounter) =>
              encounterSummaryEmbed({ encounter, interaction })
            )
            .slice(0, 10)
        : [
            new EmbedBuilder({
              description: 'No encounters yet. `/adventure` to find some!',
            }),
          ],
  })
}
