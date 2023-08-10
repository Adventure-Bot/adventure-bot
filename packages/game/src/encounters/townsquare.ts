import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  ComponentType,
  EmbedBuilder,
  Message,
} from 'discord.js'

import { EmojiValue } from '@adventure-bot/game/Emoji'
import {
  decoratedName,
  findOrCreateCharacter,
} from '@adventure-bot/game/character'
import shop from '@adventure-bot/game/commands/shop'
import { roguesGuild } from '@adventure-bot/game/encounters/shrine'
import { tavern } from '@adventure-bot/game/encounters/tavern/tavern'
import { thugs } from '@adventure-bot/game/encounters/thugs'
import {
  CommandHandlerOptions,
  asset,
  weightedTable,
} from '@adventure-bot/game/utils'

export const townSquare = async ({
  interaction,
}: CommandHandlerOptions): Promise<void> => {
  const character = findOrCreateCharacter(interaction.user)
  const message = await interaction.channel?.send({
    embeds: [
      new EmbedBuilder({
        title: `${decoratedName(character)} has arrived at the town square!`,
        color: Colors.Grey,
        description: `You've arrived in a bustling town square. Where to?`,
        fields: [
          {
            name: 'Your gold',
            value: EmojiValue('gold', character.gold),
          },
        ],
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
  if (response.customId === 'shop') await shop.execute({ interaction })
  if (response.customId === 'tavern') await tavern({ interaction })
  if (response.customId === 'dark_alley') {
    await weightedTable([
      [1, () => roguesGuild({ interaction })],
      [2, () => thugs({ interaction })],
    ])()
  }
}
