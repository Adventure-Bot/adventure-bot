import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  Message,
  SelectMenuBuilder,
} from 'discord.js'

import { findOrCreateCharacter } from '@adventure-bot/game/character'
import { equippableInventory, itemSelect } from '@adventure-bot/game/equipment'
import store from '@adventure-bot/game/store'
import { itemEquipped } from '@adventure-bot/game/store/slices/characters'

/**
 * Prompt to equip from available inventory items.
 * @param interaction
 * @returns
 */
export const equipInventoryItemPrompt = async (
  interaction: CommandInteraction
): Promise<void> => {
  const character = findOrCreateCharacter(interaction.user)
  const inventory = equippableInventory(character)
  if (inventory.length === 0) {
    interaction.channel?.send({
      content: 'No inventory items available to equip',
    })
    return
  }
  const message = await interaction.channel?.send({
    content: 'What would you like to equip?',
    components: [
      new ActionRowBuilder<SelectMenuBuilder>({
        components: [
          itemSelect({
            inventory: inventory,
            placeholder: 'Choose an item to equip.',
          }),
        ],
      }),
      new ActionRowBuilder<ButtonBuilder>({
        components: [
          new ButtonBuilder({
            customId: 'done',
            style: ButtonStyle.Primary,
            label: 'Done',
          }),
        ],
      }),
    ],
  })
  if (!(message instanceof Message)) return

  let done = false

  while (!done) {
    const response = await message
      .awaitMessageComponent({
        filter: (interaction) => {
          interaction.deferUpdate()
          return interaction.user.id === interaction.user.id
        },
        time: 60000,
      })
      .catch(() => {
        message.edit({ components: [] })
      })
    if (!response) return
    if (response.isButton() && response.customId === 'done') {
      message.delete()
      done = true
    }
    if (response.isSelectMenu()) {
      const item = inventory[parseInt(response.values[0])]
      const character = findOrCreateCharacter(interaction.user)
      store.dispatch(
        itemEquipped({ itemId: item.id, characterId: character.id })
      )
      interaction.channel?.send(
        `${character.name} equipped their ${item.name}.`
      )
    }
  }
}
