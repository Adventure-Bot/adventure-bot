import { SlashCommandBuilder } from '@discordjs/builders'
import { randomUUID } from 'crypto'
import { MessageEmbed } from 'discord.js'
import { values } from 'remeda'

import {
  decoratedName,
  findOrCreateCharacter,
} from '@adventure-bot/game/character'
import { effects } from '@adventure-bot/game/statusEffects'
import store from '@adventure-bot/game/store'
import { effectAdded } from '@adventure-bot/game/store/slices/statusEffects'
import { CommandHandlerOptions } from '@adventure-bot/game/utils'

export const command = new SlashCommandBuilder()
  .setName('effect')
  .setDescription('Conjure an effect')

function effectList(): string {
  return values(effects)
    .map((effect, i) => `\`${(i + 1).toString().padStart(3)}\` ${effect.name}`)
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
        )} conjures an effect!`,
        description: `Which shall it be?\n\n${effectList()}\n\nEnter the number of the effect you wish to conjure.`,
      }),
    ],
  })
  if (!interaction.channel) return
  const collector = interaction.channel.createMessageCollector({
    time: 15000,
  })

  collector.on('collect', (message) => {
    const input = parseInt(message.content)
    const effect = values(effects)[input - 1]
    if (!effect) {
      interaction.editReply(`That's not a valid effect.`)
      return
    }
    store.dispatch(
      effectAdded({
        characterId: interaction.user.id,
        effect: {
          ...effect,
          id: randomUUID(),
          started: new Date().toString(),
        },
      })
    )
  })
}

export default { command, execute }
