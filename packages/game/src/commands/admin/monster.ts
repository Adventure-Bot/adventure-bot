import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'

import {
  decoratedName,
  findOrCreateCharacter,
} from '@adventure-bot/game/character'
import { monster } from '@adventure-bot/game/encounters'
import {
  createMonster,
  monsterList,
  monstersByName,
} from '@adventure-bot/game/monster'
import { CommandHandlerOptions } from '@adventure-bot/game/utils'

export const command = new SlashCommandBuilder()
  .setName('monster')
  .setDescription('Encounter a monster')

export const execute = async ({
  interaction,
}: CommandHandlerOptions): Promise<void> => {
  await interaction.channel?.send({
    embeds: [
      new EmbedBuilder({
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
      interaction.channel?.send(`${selectedMonster} is not a valid choice.`)
      return
    }
    monster({
      interaction,
      monster: createMonster(selectedMonster[1]()),
    })
    collector.stop()
  })
}

export default { command, execute }
