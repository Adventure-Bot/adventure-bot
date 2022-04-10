import { SlashCommandBuilder } from '@discordjs/builders'
import { MessageEmbed } from 'discord.js'
import { values } from 'remeda'

import {
  decoratedName,
  findOrCreateCharacter,
} from '@adventure-bot/game/character'
import * as items from '@adventure-bot/game/equipment/items'
import store from '@adventure-bot/game/store'
import { itemReceived } from '@adventure-bot/game/store/actions'
import { CommandHandlerOptions } from '@adventure-bot/game/utils'

export const command = new SlashCommandBuilder()
  .setName('item')
  .setDescription('Conjure an item')

function itemList(): string {
  return values(items)
    .map((item, i) => `\`${(i + 1).toString().padStart(3)}\` ${item().name}`)
    .join('\n')
}

export const execute = async ({
  interaction,
}: CommandHandlerOptions): Promise<void> => {
  await interaction.editReply({
    embeds: [
      new MessageEmbed({
        title: `${decoratedName(
          findOrCreateCharacter(interaction.user)
        )} conjures an item!`,
        description: `Which shall it be?\n\n${itemList()}\n\nEnter the number of the item you wish to conjure.`,
      }),
    ],
  })
  if (!interaction.channel) return
  const collector = interaction.channel.createMessageCollector({
    time: 15000,
  })

  collector.on('collect', (message) => {
    const input = parseInt(message.content)
    const createItem = values(items)[input - 1]
    if (!createItem) {
      interaction.editReply(`That's not a valid item.`)
      return
    }
    store.dispatch(
      itemReceived({
        characterId: findOrCreateCharacter(interaction.user).id,
        item: createItem(),
        interaction,
      })
    )
  })
}

export default { command, execute }
