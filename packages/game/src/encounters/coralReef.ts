import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  ComponentType,
  EmbedBuilder,
  Message,
} from 'discord.js'

import {
  decoratedName,
  findOrCreateCharacter,
} from '@adventure-bot/game/character'
import { chest } from '@adventure-bot/game/encounters/chest'
import { monster } from '@adventure-bot/game/encounters/monster'
import { createMonster } from '@adventure-bot/game/monster'
import { createGiantCrab } from '@adventure-bot/game/monster/monsters/createGiantCrab'
import { createShark } from '@adventure-bot/game/monster/monsters/createShark'
import {
  CommandHandlerOptions,
  asset,
  weightedTable,
} from '@adventure-bot/game/utils'

export async function coralReef({
  interaction,
}: CommandHandlerOptions): Promise<void> {
  const character = findOrCreateCharacter(interaction.user)
  const message = await interaction.channel?.send({
    embeds: [
      new EmbedBuilder({
        title: `${decoratedName(character)} encountered a coral reef!`,
        color: Colors.Blue,
      }).setImage(asset('fantasy', 'places', 'coral reef').s3Url),
    ],
    components: [
      new ActionRowBuilder<ButtonBuilder>({
        components: [
          new ButtonBuilder({
            customId: 'explore',
            label: 'Explore',
            style: ButtonStyle.Primary,
          }),
          new ButtonBuilder({
            customId: 'leave',
            label: 'Leave',
            style: ButtonStyle.Secondary,
          }),
        ],
      }),
    ],
  })

  if (!(message instanceof Message)) return

  const response = await message
    .awaitMessageComponent({
      componentType: ComponentType.Button,
      filter: (i) => {
        i.deferUpdate()
        return i.user.id === interaction.user.id
      },
    })
    .finally(() => message.edit({ components: [] }))

  if (!response.isButton()) return
  if (response.customId === 'leave') {
    await interaction.channel?.send('You leave the reef.')
    return
  }
  weightedTable<() => void>([
    [1, () => chest({ interaction })],
    [
      2,
      () =>
        monster({
          interaction,
          monster: createMonster(
            weightedTable([
              [1, createShark],
              [1, createGiantCrab],
            ])()
          ),
        }),
    ],
  ])()
}
