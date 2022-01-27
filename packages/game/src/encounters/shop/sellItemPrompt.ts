import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageAttachment,
  MessageButton,
  MessageEmbed,
} from 'discord.js'

import { EmojiValue } from '@adventure-bot/game/Emoji'
import {
  getCharacterUpdate,
  getUserCharacter,
  gpGainField,
} from '@adventure-bot/game/character'
import { getSaleRate } from '@adventure-bot/game/encounters/shop/getSaleRate'
import { sellList } from '@adventure-bot/game/encounters/shop/sellList'
import { sellValue } from '@adventure-bot/game/encounters/shop/sellValue'
import { itemEmbed } from '@adventure-bot/game/equipment'
import store from '@adventure-bot/game/store'
import { itemSold } from '@adventure-bot/game/store/slices/characters'

export async function sellItemPrompt({
  interaction,
}: {
  interaction: CommandInteraction
}): Promise<void> {
  const saleRate = getSaleRate()
  const shopImage = new MessageAttachment(
    './images/weapon-shop.jpg',
    'shop.png'
  )

  const character = getUserCharacter(interaction.user)
  const inventory = character.inventory.filter((i) => i.sellable)
  const message = await interaction.editReply({
    embeds: [
      new MessageEmbed({ title: 'Sell which item?' }).setImage(
        `attachment://${shopImage.name}`
      ),
      ...inventory.map((item) =>
        itemEmbed({ item, interaction, saleRate: saleRate })
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
  store.dispatch(itemSold({ itemId: item.id, characterId: character.id }))

  interaction.followUp({
    embeds: [
      new MessageEmbed({
        fields: [
          gpGainField(sellValue(item)),
          {
            name: `${character.name}'s Total Gold`,
            value: EmojiValue('gold', getCharacterUpdate(character).gold),
          },
        ],
      }),
    ],
    content: `${character.name} sold their ${item.name}.`,
  })
}
