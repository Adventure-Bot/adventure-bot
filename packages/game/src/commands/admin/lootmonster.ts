import { SlashCommandBuilder } from '@discordjs/builders'
import { MessageEmbed } from 'discord.js'

import {
  characterEmbed,
  decoratedName,
  findOrCreateCharacter,
  getCharacterUpdate,
  inventoryFields,
  loot,
  lootResultEmbed,
} from '@adventure-bot/game/character'
import {
  monsterEmbed,
  monsterList,
  monstersByName,
} from '@adventure-bot/game/monster'
import { CommandHandlerOptions } from '@adventure-bot/game/utils'

export const command = new SlashCommandBuilder()
  .setName('lootmonster')
  .setDescription('Loot a random monster.')

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

  collector.on('collect', async (message) => {
    const input = parseInt(message.content)
    if (!monstersByName[input - 1]) {
      interaction.editReply(`That's not a valid monster.`)
      return
    }
    const monster = monstersByName[input - 1][1]()
    const character = findOrCreateCharacter(interaction.user)
    const result = await loot({
      looterId: character.id,
      targetId: monster.id,
      interaction,
    })
    interaction.followUp({
      embeds: [
        monsterEmbed(monster),
        characterEmbed({
          character: getCharacterUpdate(character),
        }).addFields(...inventoryFields(character)),
      ].concat(result ? lootResultEmbed({ result, interaction }) : []),
    })
  })
}

export default { command, execute }
