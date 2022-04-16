import { SlashCommandBuilder } from '@discordjs/builders'
import { MessageEmbed } from 'discord.js'

import {
  decoratedName,
  findOrCreateCharacter,
} from '@adventure-bot/game/character'
import { monster } from '@adventure-bot/game/encounters'
import { monsterList, monstersByName } from '@adventure-bot/game/monster'
import { CommandHandlerOptions } from '@adventure-bot/game/utils'

export const command = new SlashCommandBuilder()
  .setName('monster')
  .setDescription('Encounter a monster')

export const execute = async ({
  interaction,
}: CommandHandlerOptions): Promise<void> => {
  await interaction.editReply({
    embeds: [
      new MessageEmbed({
        title: `${decoratedName(
          findOrCreateCharacter(interaction.user)
        )} searches for trouble!`,
        description: `Which shall it be?\n\n${monsterList()}\n\nEnter a number.`,
      }),
    ],
  })
  if (!interaction.channel) return
  const collector = interaction.channel.createMessageCollector({
    time: 15000,
  })

  collector.on('collect', (message) => {
    if (message.author.id !== interaction.user.id) return
    const input = parseInt(message.content)
    const selectedMonster = monstersByName[input - 1]
    if (!selectedMonster) {
      interaction.followUp(`${selectedMonster} is not a valid choice.`)
      return
    }
    monster({
      interaction,
      replyType: 'followUp',
      monster: selectedMonster[1](),
    })
    collector.stop()
  })
}

export default { command, execute }
