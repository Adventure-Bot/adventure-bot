import { CommandInteraction, MessageEmbed } from 'discord.js'
import { awardXP } from '../character/awardXP'
import { xpGainField } from '../character/xpGainField'
import { randomArrayElement } from '../monster/randomArrayElement'
import { getAsset } from '../utils/getAsset'

export const travel = async (
  interaction: CommandInteraction
): Promise<void> => {
  awardXP(interaction.user.id, 1)
  const { s3Url } = randomArrayElement([
    getAsset('fantasy', 'places', 'a lone traveler in the desert'),
    getAsset('fantasy', 'places', 'a lone traveler in the forest'),
    getAsset('fantasy', 'places', 'a lone traveler in the mountains'),
    getAsset('fantasy', 'places', 'a lone traveler in the plains'),
  ])
  await interaction.editReply({
    embeds: [
      new MessageEmbed({
        title: `${interaction.user.username} travels`,
        color: 'GREEN',
        fields: [xpGainField(interaction, 1)],
        description: `You travel the lands.`,
      }).setImage(s3Url),
    ],
  })
}
