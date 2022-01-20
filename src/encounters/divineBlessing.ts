import { CommandInteraction, MessageEmbed } from 'discord.js'
import { grantDivineBlessing } from '../grantDivineBlessing'

export const divineBlessing = async (
  interaction: CommandInteraction
): Promise<void> => {
  grantDivineBlessing(interaction.user.id)
  await interaction.editReply({
    embeds: [
      new MessageEmbed({
        title: 'Divine Blessing',
        description: `A Divine blesses you with +1 max hp!`,
        color: 'GOLD',
      }).setImage('https://imgur.com/psnFPYG.png'),
    ],
  })
}
