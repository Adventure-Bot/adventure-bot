import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'

import {
  findOrCreateCharacter,
  hpBarField,
} from '@adventure-bot/game/character'
import { CommandHandlerOptions } from '@adventure-bot/game/utils'

export const command = new SlashCommandBuilder()
  .setName('hp')
  .setDescription('Show your hp')

export const execute = async ({
  interaction,
}: CommandHandlerOptions): Promise<void> => {
  interaction.channel?.send({
    embeds: [
      new EmbedBuilder({
        fields: [
          hpBarField({ character: findOrCreateCharacter(interaction.user) }),
        ],
      }),
    ],
  })
}

export default { command, execute }
