import { SlashCommandBuilder } from '@discordjs/builders'
import { MessageEmbed } from 'discord.js'
import { values } from 'remeda'

import {
  decoratedName,
  findOrCreateCharacter,
} from '@adventure-bot/game/character'
import { quests } from '@adventure-bot/game/quest'
import store from '@adventure-bot/game/store'
import { questGranted } from '@adventure-bot/game/store/slices/characters'
import { CommandHandlerOptions } from '@adventure-bot/game/utils'

export const command = new SlashCommandBuilder()
  .setName('quest')
  .setDescription('Go on a quest')

function effectList(): string {
  return values(quests)
    .map((quest) => quest.title)
    .map((title, i) => `\`${(i + 1).toString().padStart(3)}\` ${title}`)
    .join('\n')
}

export const execute = async ({
  interaction,
}: CommandHandlerOptions): Promise<void> => {
  const character = findOrCreateCharacter(interaction.user)
  const { id: messageId } = await interaction.editReply({
    embeds: [
      new MessageEmbed({
        title: `${decoratedName(character)} desires a quest!`,
        description: `Which shall it be?\n\n${effectList()}\n\nEnter a number.`,
      }),
    ],
  })
  if (!interaction.channel) return
  const collector = interaction.channel.createMessageCollector({
    time: 15000,
    filter: (message) => message.author.id === interaction.user.id,
  })

  collector.on('collect', (message) => {
    const input = parseInt(message.content)
    const quest = values(quests)[input - 1]
    if (!quest) {
      interaction.editReply(`"${message.content}" is not a valid option.`)
      return
    }
    store.dispatch(
      questGranted({
        characterId: character.id,
        questId: quest.id,
        messageId,
      })
    )
  })
}

export default { command, execute }
