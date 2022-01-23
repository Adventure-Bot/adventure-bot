import { CommandInteraction, MessageEmbed } from 'discord.js'

import { awardXP, xpGainField } from '@adventure-bot/character'
import { asset, randomArrayElement } from '@adventure-bot/utils'

export const travel = async (
  interaction: CommandInteraction
): Promise<void> => {
  awardXP(interaction.user.id, 1)
  const { s3Url } = randomArrayElement([
    asset('fantasy', 'places', 'a lone traveler in the desert'),
    asset('fantasy', 'places', 'a lone traveler in the forest'),
    asset('fantasy', 'places', 'a lone traveler in the mountains'),
    asset('fantasy', 'places', 'a lone traveler in the plains'),
  ])
  await interaction.editReply({
    embeds: [
      new MessageEmbed({
        title: `${interaction.user.username} travels`,
        color: 'GREEN',
        fields: [xpGainField(1)],
        description: `You travel the lands.`,
      }).setImage(s3Url),
    ],
  })
}
