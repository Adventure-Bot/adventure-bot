import { SlashCommandBuilder } from '@discordjs/builders'

import { findOrCreateCharacter } from '@adventure-bot/game/character'
import { actionEmbed } from '@adventure-bot/game/commands/inspect/actionEmbed'
import { CommandHandlerOptions } from '@adventure-bot/game/utils'

export const command = new SlashCommandBuilder()
  .setName('cooldowns')
  .setDescription('Check your cooldowns.')

export const execute = async ({
  interaction,
}: CommandHandlerOptions): Promise<void> => {
  const character = findOrCreateCharacter(interaction.user)
  await interaction.editReply({
    embeds: [actionEmbed({ character, interaction })],
  })
}

export default { command, execute }
