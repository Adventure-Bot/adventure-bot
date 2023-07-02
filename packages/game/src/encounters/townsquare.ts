import {
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from 'discord.js'

import { EmojiValue } from '@adventure-bot/game/Emoji'
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
      new MessageEmbed({
        title: `${decoratedName(character)} has arrived at the town square!`,
        color: 'GREY',
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
      new MessageActionRow({
        components: [
          new MessageButton({
            customId: 'shop',
            label: 'Shop',
            style: 'PRIMARY',
          }),
          new MessageButton({
            customId: 'tavern',
            label: 'Tavern',
            style: 'PRIMARY',
          }),
          new MessageButton({
            customId: 'dark_alley',
            label: 'Dark Alley',
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
