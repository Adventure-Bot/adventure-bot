import { CommandInteraction, MessageEmbed } from 'discord.js'

import { EmojiModifier } from '@adventure-bot/game/Emoji'
import { getUserCharacter, statField } from '@adventure-bot/game/character'
import store from '@adventure-bot/game/store'
import { grantDivineBlessing } from '@adventure-bot/game/store/slices/characters'
import { asset } from '@adventure-bot/game/utils'

export const divineBlessing = async (
  interaction: CommandInteraction
): Promise<void> => {
  store.dispatch(grantDivineBlessing(interaction.user.id))
  const art = asset('fantasy', 'magic', 'a divine blessing')
  const character = getUserCharacter(interaction.user)

  await interaction.editReply({
    files: [art.attachment],
    embeds: [
      new MessageEmbed({
        title: `${interaction.user.username} is blessed by the Divine!`,
        description: `You gain a permanent ${EmojiModifier(
          'maxHP',
          1
        )} Max Health!`,
        color: 'GOLD',
        fields: [statField(character, interaction, 'maxHP')],
      }).setImage(art.attachmentString),
    ],
  })
}
