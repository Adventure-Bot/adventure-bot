import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  ComponentType,
  Message,
  SlashCommandBuilder,
  TextChannel,
} from 'discord.js'

import {
  decoratedName,
  findOrCreateCharacter,
} from '@adventure-bot/game/character'
import { getHook } from '@adventure-bot/game/commands/inspect/getHook'
import {
  equipInventoryItemPrompt,
  equippableInventory,
  isTradeable,
  itemEmbed,
  offerItemPrompt,
  usableInventory,
  useInventoryItemPrompt,
} from '@adventure-bot/game/equipment'
import { CommandHandlerOptions } from '@adventure-bot/game/utils'

export const command = new SlashCommandBuilder()
  .setName('inventory')
  .setDescription('View your inventory.')

export const execute = async ({
  interaction,
}: CommandHandlerOptions): Promise<void> => {
  const character = findOrCreateCharacter(interaction.user)
  if (!character.inventory.length) {
    await interaction.followUp('Your inventory is empty.')
    return
  }
  const message = await interaction.followUp({
    content: `${decoratedName(character)}'s checks their bags.`,
    components: [inventoryComponents(interaction)],
  })
  if (!(message instanceof Message)) return
  const channel = interaction.channel
  if (!(channel instanceof TextChannel)) return
  const thread = await channel.threads.create({
    name: `${character.name}'s inventory`,
  })
  const hook = await getHook({
    name: 'Inventory',
    channel,
  })
  if (!hook) {
    await interaction.followUp(`Inventory hook not found.`)
    return
  }

  await Promise.all(
    character.inventory.map((item) =>
      hook.send({
        embeds: [itemEmbed({ item, showEquipStatusFor: character })],
        threadId: thread.id,
      })
    )
  )
  thread.setArchived(true)

  let done = false
  while (!done) {
    const reply = await message
      .awaitMessageComponent({
        time: 30000,
        filter: (i) => {
          i.deferUpdate()
          return i.user.id === interaction.user.id
        },
        componentType: ComponentType.Button,
      })
      .catch(() => {
        message.edit({
          components: [],
        })
      })
    if (!reply) return
    if (reply.customId === 'equip') await equipInventoryItemPrompt(interaction)
    if (reply.customId === 'offer') await offerItemPrompt(interaction)
    if (reply.customId === 'use') await useInventoryItemPrompt(interaction)
    if (reply.customId === 'done') done = true
    await message.edit({
      content: `${decoratedName(character)}'s checks their bags.`,
      components: [inventoryComponents(interaction)],
    })
  }
  message.edit({ components: [] })
}

export default { command, execute }

function inventoryComponents(
  interaction: CommandInteraction
): ActionRowBuilder<ButtonBuilder> {
  const components = new ActionRowBuilder<ButtonBuilder>()
  const character = findOrCreateCharacter(interaction.user)
  const hasItemsToOffer = character.inventory.filter(isTradeable).length > 0
  const hasItemsToEquip = equippableInventory(character).length > 0
  const hasItemsToUse = usableInventory(character).length > 0

  if (hasItemsToEquip)
    components.addComponents(
      new ButtonBuilder({
        customId: 'equip',
        style: ButtonStyle.Secondary,
        label: 'Equip',
      })
    )
  if (hasItemsToUse)
    components.addComponents(
      new ButtonBuilder({
        customId: 'use',
        style: ButtonStyle.Secondary,
        label: 'Use',
      })
    )
  if (hasItemsToOffer)
    components.addComponents(
      new ButtonBuilder({
        customId: 'offer',
        style: ButtonStyle.Secondary,
        label: 'Offer',
      })
    )

  components.addComponents(
    new ButtonBuilder({
      customId: 'done',
      style: ButtonStyle.Secondary,
      label: 'Done',
    })
  )
  return components
}
