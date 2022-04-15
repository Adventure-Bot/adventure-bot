import {
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from 'discord.js'

import {
  decoratedName,
  findOrCreateCharacter,
} from '@adventure-bot/game/character'
import { chest } from '@adventure-bot/game/encounters/chest'
import { monster } from '@adventure-bot/game/encounters/monster'
import { Monster } from '@adventure-bot/game/monster'
import { createGiantCrab } from '@adventure-bot/game/monster/monsters/createGiantCrab'
import { createShark } from '@adventure-bot/game/monster/monsters/createShark'
import {
  CommandHandlerOptions,
  asset,
  weightedTable,
} from '@adventure-bot/game/utils'

export async function coralReef({
  interaction,
  replyType = 'editReply',
}: CommandHandlerOptions): Promise<void> {
  const character = findOrCreateCharacter(interaction.user)
  const message = await interaction[replyType]({
    embeds: [
      new MessageEmbed({
        title: `${decoratedName(character)} encountered a coral reef!`,
        color: 'BLUE',
      }).setImage(asset('fantasy', 'places', 'coral reef').s3Url),
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
    await interaction.followUp('You leave the reef.')
    return
  }
  weightedTable<() => void>([
    [1, () => chest({ interaction, replyType: 'followUp' })],
    [
      2,
      () =>
        monster({
          interaction,
          replyType: 'followUp',
          monster: weightedTable<() => Monster>([
            [1, createShark],
            [1, createGiantCrab],
          ])(),
        }),
    ],
  ])()
}
