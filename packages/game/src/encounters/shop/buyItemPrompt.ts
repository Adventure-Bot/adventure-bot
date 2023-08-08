import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  ComponentType,
  Message,
} from 'discord.js'

import { findOrCreateCharacter } from '@adventure-bot/game/character'
import { buyItem } from '@adventure-bot/game/encounters/shop/buyItem'
import { buyList } from '@adventure-bot/game/encounters/shop/buyList'
import { Item } from '@adventure-bot/game/equipment'

export async function buyItemPrompt({
  interaction,
  message,
  inventory,
}: {
  interaction: CommandInteraction
  message: Message
  inventory: Item[]
}): Promise<void | Item> {
  await message.edit({
    components: [
      new ActionRowBuilder<ButtonBuilder>({
        components: [buyList({ inventory, interaction })],
      }),
      new ActionRowBuilder<ButtonBuilder>({
        components: [
          new ButtonBuilder({
            customId: 'cancel',
            style: ButtonStyle.Secondary,
            label: 'Nevermind',
          }),
        ],
      }),
    ],
  })
  if (!(message instanceof Message)) return
  const response = await message
    .awaitMessageComponent({
      filter: (i) => {
        i.deferUpdate()
        return i.user.id === interaction.user.id
      },
      time: 60000,
    })
    .catch(() => {
      message.edit({
        components: [],
      })
    })
  if (!response) return
  if (response.componentType !== ComponentType.StringSelect) return
  const item = inventory.find(({ id }) => id === response.values[0])
  if (!item) return
  await buyItem(interaction, findOrCreateCharacter(interaction.user), item)
  return item
}
