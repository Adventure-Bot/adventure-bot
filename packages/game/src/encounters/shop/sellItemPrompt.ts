import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from 'discord.js'

import {
  decoratedName,
  findOrCreateCharacter,
} from '@adventure-bot/game/character'
import { sellList } from '@adventure-bot/game/encounters/shop/sellList'
import { sellValue } from '@adventure-bot/game/encounters/shop/sellValue'
import store from '@adventure-bot/game/store'
import { itemSold } from '@adventure-bot/game/store/slices/characters'
import { asset } from '@adventure-bot/game/utils'

export async function sellItemPrompt({
  interaction,
  message,
}: {
  interaction: CommandInteraction
  message: Message
}): Promise<void> {
  const character = findOrCreateCharacter(interaction.user)
  const inventory = character.inventory.filter((i) => i.sellable)
  await message.edit({
    embeds: [
      new MessageEmbed({
        title: `${decoratedName(character)} considers what to sell.`,
        description: 'What would you like to sell?',
      }).setImage(
        asset('fantasy', 'places', 'blacksmith', interaction.id).s3Url
      ),
    ],
    components: [
      new MessageActionRow({
        components: [
          sellList({
            inventory,
            interaction,
          }),
        ],
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

  store.dispatch(
    itemSold({
      itemId: item.id,
      characterId: character.id,
      sellValue: sellValue(item),
    })
  )

  interaction.followUp({
    embeds: [
      new MessageEmbed({
        title: `${character.name} sold their ${item.name}.`,
      }),
    ],
  })
}
