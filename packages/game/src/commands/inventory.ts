import { SlashCommandBuilder } from '@discordjs/builders'
import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageButton,
  MessageOptions,
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
    ...inventoryMain(interaction),
    fetchReply: true,
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
}

export default { command, execute }

function inventoryMain(interaction: CommandInteraction): MessageOptions {
  const character = findOrCreateCharacter(interaction.user)
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
