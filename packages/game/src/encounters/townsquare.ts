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
import { statContest } from '@adventure-bot/game/character/statContest'
import shop from '@adventure-bot/game/commands/shop'
import { monster } from '@adventure-bot/game/encounters/monster'
import { roguesGuild } from '@adventure-bot/game/encounters/shrine'
import { tavern } from '@adventure-bot/game/encounters/tavern/tavern'
import { createMonster, createTabaxi } from '@adventure-bot/game/monster'
import { CommandHandlerOptions, asset } from '@adventure-bot/game/utils'

export const townSquare = async ({
  interaction,
  replyType = 'editReply',
}: CommandHandlerOptions): Promise<void> => {
  const character = findOrCreateCharacter(interaction.user)
  const message = await interaction[replyType]({
    embeds: [
      new EmbedBuilder({
        title: `${decoratedName(character)} has arrived at the town square!`,
        color: Colors.Grey,
        description: `You've arrived in a bustling town square. Where to?`,
      }).setImage(asset('fantasy', 'places', 'town square').s3Url),
    ],
    components: [
      new ActionRowBuilder<ButtonBuilder>({
        components: [
          new ButtonBuilder({
            customId: 'shop',
            label: 'Shop',
            style: ButtonStyle.Primary,
          }),
          new ButtonBuilder({
            customId: 'tavern',
            label: 'Tavern',
            style: ButtonStyle.Primary,
          }),
          new ButtonBuilder({
            customId: 'dark_alley',
            label: 'Dark Alley',
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
  if (response.customId === 'shop')
    await shop.execute({ interaction, replyType: 'followUp' })
  if (response.customId === 'tavern')
    await tavern({ interaction, replyType: 'followUp' })
  if (response.customId === 'dark_alley') {
    if (statContest({ character, stat: 'luck', difficulty: 14 }).success) {
      await roguesGuild({ interaction, replyType: 'followUp' })
    } else {
      await monster({
        monster: createMonster(createTabaxi()),
        interaction,
        replyType: 'followUp',
      })
    }
  }
}
