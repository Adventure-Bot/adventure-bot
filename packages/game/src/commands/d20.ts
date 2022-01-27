import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'

import { d20Emoji } from '@adventure-bot/game/Emoji'
import { d20 } from '@adventure-bot/game/utils'

export const command = new SlashCommandBuilder()
  .setName('d20')
  .setDescription('Roll a d20.')

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  interaction.editReply({
    content: d20Emoji(d20()),
  })
}

export default { command, execute }
