import {
  ActionRowBuilder,
  BaseMessageOptions,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  ComponentType,
  EmbedBuilder,
  Message,
} from 'discord.js'

import { EmojiValue } from '@adventure-bot/game/Emoji'
import {
  findOrCreateCharacter,
  getCharacterUpdate,
} from '@adventure-bot/game/character'
import { didFindCrown } from '@adventure-bot/game/crown'
import { buyItemPrompt } from '@adventure-bot/game/encounters/shop/buyItemPrompt'
import { sellItemPrompt } from '@adventure-bot/game/encounters/shop/sellItemPrompt'
import { itemEmbed } from '@adventure-bot/game/equipment'
import { heavyCrown } from '@adventure-bot/game/equipment/items'
import store from '@adventure-bot/game/store'
import {
  selectShopInventory,
  shopInventoryAdded,
  shopRestocked,
} from '@adventure-bot/game/store/slices/shop'
import { CommandHandlerOptions, asset } from '@adventure-bot/game/utils'

const inventory = () => selectShopInventory(store.getState())

export const shop = async ({
  interaction,
}: CommandHandlerOptions): Promise<void> => {
  store.dispatch(shopRestocked())
  if (didFindCrown()) {
    store.dispatch(shopInventoryAdded(heavyCrown()))
  }
  const message = await interaction.channel?.send(shopMain(interaction))
  if (!(message instanceof Message)) return
  let hasLeft = false
  while (!hasLeft) {
    await message.edit(shopMain(interaction))
    const response = await message
      .awaitMessageComponent({
        filter: (i) => {
          i.deferUpdate()
          return i.user.id === interaction.user.id
        },
        componentType: ComponentType.Button,
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
}

function shopMain(interaction: CommandInteraction): BaseMessageOptions {
  const character = findOrCreateCharacter(interaction.user)
  const hasStuffToSell =
    character.inventory.filter((i) => i.sellable).length > 0

  const shopEmbed = new EmbedBuilder({
    title: `${character.name} Visits the Shop`,
    fields: [
      {
        name: 'Your Gold',
        value: EmojiValue('gold', getCharacterUpdate(character).gold),
      },
    ],
  })
    .setImage(asset('fantasy', 'places', 'shop', interaction.id).s3Url)
    .setThumbnail(character.profile)
  return {
    embeds: [shopEmbed, ...inventory().map((item) => itemEmbed({ item }))],
    components: [
      new ActionRowBuilder<ButtonBuilder>({
        components: [
          new ButtonBuilder({
            customId: 'buy',
            label: 'Buy',
            style: ButtonStyle.Primary,
          }),
        ]
          .concat(
            hasStuffToSell
              ? new ButtonBuilder({
                  customId: 'sell',
                  label: 'Sell',
                  style: ButtonStyle.Primary,
                })
              : []
          )
          .concat(
            new ButtonBuilder({
              customId: 'leave',
              label: 'Leave',
              style: ButtonStyle.Secondary,
            })
          ),
      }),
    ],
  }
}
