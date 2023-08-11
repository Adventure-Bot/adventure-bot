import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  ComponentType,
  EmbedBuilder,
  Message,
  StringSelectMenuBuilder,
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
      new EmbedBuilder({
        title: `${decoratedName(character)} considers what to sell.`,
        description: 'What would you like to sell?',
      }).setImage(
        asset('fantasy', 'places', 'blacksmith', interaction.id).s3Url
      ),
    ],
    components: [
      new ActionRowBuilder<StringSelectMenuBuilder>({
        components: [
          sellList({
            character,
            inventory,
          }),
        ],
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
  const item = findOrCreateCharacter(interaction.user).inventory.find(
    ({ id }) => id === response.values[0]
  )
  if (!item) return

  store.dispatch(
    itemSold({
      itemId: item.id,
      characterId: character.id,
      sellValue: sellValue(item),
    })
  )

  interaction.channel?.send({
    embeds: [
      new EmbedBuilder({
        title: `${character.name} sold their ${item.name}.`,
      }),
    ],
  })
}
