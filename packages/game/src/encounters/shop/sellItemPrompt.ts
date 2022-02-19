import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from 'discord.js'

import { EmojiValue } from '@adventure-bot/game/Emoji'
import {
  decoratedName,
  getCharacterUpdate,
  getUserCharacter,
  gpGainField,
} from '@adventure-bot/game/character'
import { sellList } from '@adventure-bot/game/encounters/shop/sellList'
import { sellValue } from '@adventure-bot/game/encounters/shop/sellValue'
import store from '@adventure-bot/game/store'
import { itemSold } from '@adventure-bot/game/store/slices/characters'
import { asset } from '@adventure-bot/game/utils'

export async function sellItemPrompt({
  interaction,
}: {
  interaction: CommandInteraction
}): Promise<void> {
  const character = getUserCharacter(interaction.user)
  const inventory = character.inventory.filter((i) => i.sellable)
  const message = await interaction.editReply({
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
  store.dispatch(itemSold({ itemId: item.id, characterId: character.id }))

  interaction.followUp({
    embeds: [
      new MessageEmbed({
        title: `${decoratedName(character)} sold their ${item.name}.`,
        fields: [
          gpGainField(sellValue(item)),
          {
            name: `${decoratedName(character)}'s Total Gold`,
            value: EmojiValue('gold', getCharacterUpdate(character).gold),
          },
        ],
      }),
    ],
  })
}
