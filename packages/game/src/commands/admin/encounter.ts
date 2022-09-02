import { SlashCommandBuilder } from '@discordjs/builders'
import { Message, MessageEmbed } from 'discord.js'

import {
  decoratedName,
  findOrCreateCharacter,
} from '@adventure-bot/game/character'
import { encountersByName } from '@adventure-bot/game/encounters'
import { CommandHandlerOptions } from '@adventure-bot/game/utils'

export const command = new SlashCommandBuilder()
  .setName('encounter')
  .setDescription('Trigger a specific encounter')

function encounterList(): string {
  return encountersByName
    .map(([name], i) => `\`${(i + 1).toString().padStart(3)}\` ${name}`)
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
        )} desires an encounter!`,
        description: `Which shall it be?\n\n${encounterList()}\n\nEnter a number.`,
      }),
    ],
  })

  if (!interaction.channel) return
  const collector = interaction.channel.createMessageCollector({
    time: 15000,
    filter: (message: Message) => message.author.id === interaction.user.id,
  })

  collector.on('collect', (message) => {
    const input = parseInt(message.content)
    const encounter = encountersByName[input - 1]
    if (!encounter) return
    if (!encounter[1]) {
      interaction.editReply(`That's not a valid encounter.`)
      return
    }
    encounter[1]({ interaction, replyType: 'followUp' })
  })
}

export default { command, execute }
