import {
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from 'discord.js'

import { EmojiValue } from '@adventure-bot/game/Emoji'
import {
  findOrCreateCharacter,
  getCharacterUpdate,
} from '@adventure-bot/game/character'
import { buyItemPrompt } from '@adventure-bot/game/encounters/shop/buyItemPrompt'
import { sellItemPrompt } from '@adventure-bot/game/encounters/shop/sellItemPrompt'
import { heavyCrown, itemEmbed } from '@adventure-bot/game/equipment'
import store from '@adventure-bot/game/store'
import { selectIsHeavyCrownInPlay } from '@adventure-bot/game/store/selectors'
import {
  selectShopInventory,
  shopInventoryAdded,
  shopRestocked,
} from '@adventure-bot/game/store/slices/shop'
import { CommandHandlerOptions, asset, d } from '@adventure-bot/game/utils'

export const shop = async ({
  interaction,
  replyType = 'followUp',
}: CommandHandlerOptions): Promise<void> => {
  const character = findOrCreateCharacter(interaction.user)

  store.dispatch(shopRestocked())
  if (!selectIsHeavyCrownInPlay(store.getState()) && d(10) === 10) {
    store.dispatch(shopInventoryAdded(heavyCrown()))
  }

  const inventory = () => selectShopInventory(store.getState())

  const hasStuffToSell =
    character.inventory.filter((i) => i.sellable).length > 0

  const message = await interaction[replyType](shopMain())
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
      await buyItemPrompt({ interaction, inventory: inventory(), message })
    if (response.customId === 'sell')
      await sellItemPrompt({ interaction, message })
  }
  message.edit({ components: [] })

  function shopMain() {
    const shopEmbed = new MessageEmbed({
      title: `${character.name} Visits the Shop`,
      fields: [
        {
          name: 'Your Gold',
          value: EmojiValue('gold', getCharacterUpdate(character).gold),
        },
      ],
    }).setImage(asset('fantasy', 'places', 'blacksmith', interaction.id).s3Url)
    return {
      embeds: [shopEmbed, ...inventory().map((item) => itemEmbed({ item }))],
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
