import { SlashCommandBuilder } from '@discordjs/builders'
import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageButton,
  MessageOptions,
  TextChannel,
} from 'discord.js'

import { decoratedName, getUserCharacter } from '@adventure-bot/character'
import { getHook } from '@adventure-bot/commands/inspect/getHook'
import { equipInventoryItemPrompt } from '@adventure-bot/equipment'
import { isTradeable } from '@adventure-bot/equipment'
import { equippableInventory } from '@adventure-bot/equipment'
import { itemEmbed } from '@adventure-bot/equipment'
import { offerItemPrompt } from '@adventure-bot/equipment'
import { usableInventory } from '@adventure-bot/equipment'
import { useInventoryItemPrompt } from '@adventure-bot/equipment'

export const command = new SlashCommandBuilder()
  .setName('inventory')
  .setDescription('View your inventory.')

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const character = getUserCharacter(interaction.user)
  if (!character.inventory.length) {
    await interaction.followUp('Your inventory is empty.')
    return
  }
  const message = await interaction.followUp({
    ...inventoryMain(interaction),
    fetchReply: true,
  })
  if (!(message instanceof Message)) return
  const channel = interaction.channel
  if (!(channel instanceof TextChannel)) return
  const thread = await channel.threads.create({
    name: `${character.name}'s inventory`,
  })
  const webhooks = await channel.fetchWebhooks()
  const hook = await getHook({
    name: 'Inventory',
    webhooks,
    interaction,
  })
  if (!hook) {
    await interaction.followUp(`Inventory hook not found.`)
    return
  }

  character.inventory.forEach((item) => {
    hook.send({
      embeds: [itemEmbed({ item, interaction })],
      threadId: thread.id,
    })
  })

  let done = false
  while (!done) {
    const reply = await message
      .awaitMessageComponent({
        time: 30000,
        filter: (i) => {
          i.deferUpdate()
          return i.user.id === interaction.user.id
        },
        componentType: 'BUTTON',
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
    await message.edit(inventoryMain(interaction))
  }
  message.edit({ components: [] })
  thread.setArchived(true)
}

export default { command, execute }

function inventoryMain(interaction: CommandInteraction): MessageOptions {
  const character = getUserCharacter(interaction.user)
  const hasItemsToOffer = character.inventory.filter(isTradeable).length > 0
  const hasItemsToEquip = equippableInventory(character).length > 0
  const hasItemsToUse = usableInventory(character).length > 0

  const components = []
  if (hasItemsToEquip)
    components.push(
      new MessageButton({
        customId: 'equip',
        style: 'SECONDARY',
        label: 'Equip',
      })
    )
  if (hasItemsToUse)
    components.push(
      new MessageButton({
        customId: 'use',
        style: 'SECONDARY',
        label: 'Use',
      })
    )
  if (hasItemsToOffer)
    components.push(
      new MessageButton({
        customId: 'offer',
        style: 'SECONDARY',
        label: 'Offer',
      })
    )

  components.push(
    new MessageButton({
      customId: 'done',
      style: 'SECONDARY',
      label: 'Done',
    })
  )

  return {
    content: `${decoratedName(character)} checks their bags.`,
    components: [
      new MessageActionRow({
        components,
      }),
    ],
  }
}
