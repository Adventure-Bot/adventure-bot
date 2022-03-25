import {
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from 'discord.js'

import { decoratedName, getUserCharacter } from '@adventure-bot/game/character'
import { chest } from '@adventure-bot/game/encounters/chest'
import { monster } from '@adventure-bot/game/encounters/monster'
import { trap } from '@adventure-bot/game/encounters/trap'
import {
  CommandHandler,
  CommandHandlerOptions,
  asset,
  weightedTable,
} from '@adventure-bot/game/utils'

export const cave = async ({
  interaction,
  replyType = 'editReply',
}: CommandHandlerOptions): Promise<void> => {
  const character = getUserCharacter(interaction.user)
  const message = await interaction[replyType]({
    embeds: [
      new MessageEmbed({
        title: `${decoratedName(character)} encountered a wonderous cave!`,
        color: 'GREY',
        description: `What lies within?`,
      }).setImage(asset('fantasy', 'places', 'cave').s3Url),
    ],
    components: [
      new MessageActionRow({
        components: [
          new MessageButton({
            customId: 'explore',
            label: 'Explore',
            style: 'PRIMARY',
          }),
          new MessageButton({
            customId: 'leave',
            label: 'Leave',
            style: 'SECONDARY',
          }),
        ],
      }),
    ],
  })

  if (!(message instanceof Message)) return

  const response = await message
    .awaitMessageComponent({
      componentType: 'BUTTON',
      filter: (i) => {
        i.deferUpdate()
        return i.user.id === interaction.user.id
      },
    })
    .finally(() => message.edit({ components: [] }))

  if (!response.isButton()) return
  if (response.customId === 'leave') {
    await interaction.followUp('You leave the cave.')
    return
  }

  weightedTable<CommandHandler>([
    [1, chest],
    [1, monster],
    [1, trap],
  ])({ interaction, replyType: 'followUp' })
}
