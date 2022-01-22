import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageButton,
} from 'discord.js'

import { getUserCharacter } from '@adventure-bot/character'
import { buyItem } from '@adventure-bot/commands/buyItem'
import { buyList } from '@adventure-bot/encounters/shop/buyList'
import { Item } from '@adventure-bot/equipment'

export async function buyItemPrompt({
  interaction,
  inventory,
}: {
  interaction: CommandInteraction
  inventory: Item[]
}): Promise<void | Item> {
  const message = await interaction.editReply({
    components: [
      new MessageActionRow({
        components: [buyList({ inventory })],
      }),
      new MessageActionRow({
        components: [
          new MessageButton({
            customId: 'cancel',
            style: 'SECONDARY',
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
  if (!response.isSelectMenu()) return

  const item = inventory[parseInt(response.values[0])]
  if (!item) return
  await buyItem(interaction, getUserCharacter(interaction.user), item)
  return item
}
