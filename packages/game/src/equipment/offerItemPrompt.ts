import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageButton,
} from 'discord.js'

import { findOrCreateCharacter } from '@adventure-bot/game/character'
import {
  isTradeable,
  itemEmbed,
  itemSelect,
} from '@adventure-bot/game/equipment'
import store from '@adventure-bot/game/store'
import {
  itemGiven,
  itemRemoved,
} from '@adventure-bot/game/store/slices/characters'

export const offerItemPrompt = async (
  interaction: CommandInteraction
): Promise<void> => {
  const sender = findOrCreateCharacter(interaction.user)
  const inventory = sender.inventory.filter(isTradeable)
  if (inventory.length === 0) {
    interaction.followUp(`No items to offer.`)
    return
  }
  const message = await interaction.followUp({
    content:
      'Offer an item for grabs. First to click gets it. If time expires, it will become dust in the wind.',
    components: [
      new MessageActionRow({
        components: [
          itemSelect({
            inventory,
            placeholder: 'Which item to be rid of?',
          }),
        ],
      }),
      new MessageActionRow({
        components: [
          new MessageButton({
            customId: 'cancel',
            label: 'Nevermind',
            style: 'SECONDARY',
          }),
        ],
      }),
    ],
  })
  if (!(message instanceof Message)) return
  let timeout = false
  const response = await message
    .awaitMessageComponent({
      time: 60000,
    })
    .catch(() => {
      timeout = true
      message.edit({
        content: `${sender.name} decided not to offer any items.`,
        components: [],
      })
    })
  message.edit({ components: [] })
  if (!response) return
  if (response.isButton()) {
    message.edit({
      content: `${sender.name} decided not to offer any items.`,
      components: [],
    })
  }
  if (!response.isSelectMenu()) return
  const item = inventory[parseInt(response.values[0])]
  if (timeout || !item) return
  if (!item) return
  const offer = await interaction.followUp({
    fetchReply: true,
    content: `${sender.name} offers their ${item.name}.`,
    embeds: [itemEmbed({ item })],
    components: [
      new MessageActionRow({
        components: [
          new MessageButton({
            customId: 'take',
            label: `Take the ${item.name}.`,
            style: 'PRIMARY',
          }),
        ],
      }),
    ],
  })

  if (!(offer instanceof Message)) return
  const reply = await offer
    .awaitMessageComponent({
      componentType: 'BUTTON',
      time: 60000,
    })
    .catch(() => {
      store.dispatch(
        itemRemoved({
          characterId: sender.id,
          itemId: item.id,
        })
      )
      offer.edit({
        content: `${item.name} is dust in the wind.`,
        components: [],
      })
    })
  if (reply && reply.isButton()) {
    const recipient = findOrCreateCharacter(reply.user)
    store.dispatch(
      itemGiven({
        fromCharacterId: sender.id,
        toCharacterId: recipient.id,
        item,
      })
    )
    offer.edit({ components: [] })
    interaction.followUp(`${recipient.name} took ${sender.name}'s ${item.name}`)
  }
}
