import { CommandInteraction, MessageEmbed } from 'discord.js'

import { lootResultEmbed } from '@adventure-bot/character'
import { getLoots } from '@adventure-bot/encounters'

export function listLootResults(interaction: CommandInteraction): void {
  const loots = getLoots()
  console.log('listLootResults', loots)
  interaction.editReply({
    embeds:
      loots.length > 0
        ? loots
            .sort(
              (a, b) =>
                new Date(a.timestamp).valueOf() -
                new Date(b.timestamp).valueOf()
            )
            .map((result) => lootResultEmbed({ result, interaction }))
            .slice(0, 10)
        : [
            new MessageEmbed({
              description:
                'No loot results yet. `/adventure` to loot some monsters! (or get looted)',
            }),
          ],
  })
}
