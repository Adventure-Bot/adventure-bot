import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from 'discord.js'
import { times } from 'remeda'

import { getCharacterUpdate } from '@adventure-bot/character/getCharacterUpdate'
import { getUserCharacter } from '@adventure-bot/character/getUserCharacter'
import { buyItemPrompt } from '@adventure-bot/encounters/shop/buyItemPrompt'
import { sellItemPrompt } from '@adventure-bot/encounters/shop/sellItemPrompt'
import { goldValue } from '@adventure-bot/equipment/goldValue'
import { itemEmbed } from '@adventure-bot/equipment/itemEmbed'
import { heavyCrown } from '@adventure-bot/equipment/items'
import { randomShopItem } from '@adventure-bot/equipment/randomShopItem'
import store from '@adventure-bot/store'
import { selectIsHeavyCrownInPlay } from '@adventure-bot/store/selectors'
import { getAsset } from '@adventure-bot/utils/getAsset'

export const shop = async (interaction: CommandInteraction): Promise<void> => {
  const character = getUserCharacter(interaction.user)
  const inventory = times(3, randomShopItem)

  if (!selectIsHeavyCrownInPlay(store.getState()) && Math.random() <= 0.1) {
    inventory.push(heavyCrown())
  }

  const hasStuffToSell =
    character.inventory.filter((i) => i.sellable).length > 0

  const message = await interaction.followUp(shopMain())
  if (!(message instanceof Message)) return
  let hasLeft = false
  while (!hasLeft) {
    await message.edit(shopMain())
    const response = await message
      .awaitMessageComponent({
        filter: (i) => {
          i.deferUpdate()
          return i.user.id === interaction.user.id
        },
        componentType: 'BUTTON',
        time: 60000,
      })
      .catch(() => {
        message.edit({
          components: [],
        })
      })

    if (!response || !response.isButton()) return
    if (response.customId === 'leave') hasLeft = true
    if (response.customId === 'buy')
      await buyItemPrompt({ interaction, inventory })
    if (response.customId === 'sell') await sellItemPrompt({ interaction })
  }
  interaction.editReply({ components: [] })

  function shopMain() {
    const shopEmbed = new MessageEmbed({
      title: `${character.name} Visits the Shop`,
      fields: [
        {
          name: 'Your Gold',
          value: goldValue({
            interaction,
            goldValue: getCharacterUpdate(character).gold,
          }),
        },
      ],
    }).setImage(getAsset('fantasy', 'places', 'blacksmith').s3Url)
    return {
      embeds: [
        shopEmbed,
        ...inventory.map((item) => itemEmbed({ item, interaction })),
      ],
      components: [
        new MessageActionRow({
          components: [
            new MessageButton({
              customId: 'buy',
              label: 'Buy',
              style: 'PRIMARY',
            }),
          ]
            .concat(
              hasStuffToSell
                ? new MessageButton({
                    customId: 'sell',
                    label: 'Sell',
                    style: 'PRIMARY',
                  })
                : []
            )
            .concat(
              new MessageButton({
                customId: 'leave',
                label: 'Leave',
                style: 'SECONDARY',
              })
            ),
        }),
      ],
    }
  }
}
