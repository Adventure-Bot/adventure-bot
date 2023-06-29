import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'

import {
  decoratedName,
  findOrCreateCharacter,
  loot,
} from '@adventure-bot/game/character'
import { monsterList, monstersByName } from '@adventure-bot/game/monster'
import { CommandHandlerOptions } from '@adventure-bot/game/utils'

export const command = new SlashCommandBuilder()
  .setName('lootmonster')
  .setDescription('Loot a monster.')

export const execute = async ({
  interaction,
}: CommandHandlerOptions): Promise<void> => {
  await interaction.editReply({
    embeds: [
      new EmbedBuilder({
        title: `${decoratedName(
          findOrCreateCharacter(interaction.user)
        )} wants to loot a monster!`,
        description: `Which shall it be?\n\n${monsterList()}\n\nEnter a number.`,
      }),
    ],
  })
  if (!interaction.channel) return
  const collector = interaction.channel.createMessageCollector({
    time: 15000,
  })

  collector.on('collect', async (message) => {
    const input = parseInt(message.content)
    if (!monstersByName[input - 1]) {
      interaction.editReply(`That's not a valid monster.`)
      return
    }
    const monster = monstersByName[input - 1][1]()

    loot({
      looterId: interaction.user.id,
      targetId: monster.id,
      interaction,
    })
  })
}

export default { command, execute }
