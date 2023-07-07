import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  ComponentType,
  Message,
} from 'discord.js'

import inspect from '@adventure-bot/game/commands/inspect/inspect'
import { Item, itemEmbed } from '@adventure-bot/game/equipment'
import store from '@adventure-bot/game/store'
import { itemEquipped } from '@adventure-bot/game/store/slices/characters'

/**
 * Prompt to equip a specific item
 * @param interaction
 * @param item
 * @returns
 */
export async function equipItemPrompt({
  interaction,
  item,
  showItem = true,
}: {
  interaction: CommandInteraction
  item: Item
  showItem?: boolean
}): Promise<void> {
  const content = `Would you like to equip the ${item.name}?`
  const message = await interaction.channel?.send({
    content,
    embeds: showItem ? [itemEmbed({ item })] : [],
    components: [
      new ActionRowBuilder<ButtonBuilder>({
        components: [
          new ButtonBuilder({
            customId: 'equip',
            label: `Equip the ${item.name}`,
            style: ButtonStyle.Secondary,
          }),
        ],
      }),
    ],
  })

  if (!(message instanceof Message)) return
  const response = await message
    .awaitMessageComponent({
      filter: (interaction) => {
        interaction.deferUpdate()
        return interaction.user.id === interaction.user.id
      },
      componentType: ComponentType.Button,
      time: 60000,
    })
    .catch(() => {
      message.edit({
        content,
        components: [],
      })
    })
  if (!response) return
  store.dispatch(
    itemEquipped({ itemId: item.id, characterId: interaction.user.id })
  )
  message.edit({
    content,
    components: [],
  })
  message.reply(`${interaction.user} equipped their ${item.name}.`)
  await inspect.execute({ interaction })
}
