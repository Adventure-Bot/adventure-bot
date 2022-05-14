import { SlashCommandBuilder } from '@discordjs/builders'

import { d20Emoji } from '@adventure-bot/game/Emoji'
import { CommandHandlerOptions, d20 } from '@adventure-bot/game/utils'

export const command = new SlashCommandBuilder()
  .setName('new_game')
  .setDescription('Start a new game.')

export const execute = async ({
  interaction,
}: CommandHandlerOptions): Promise<void> => {
  interaction.editReply({
    content: d20Emoji(d20()),
  })
}

export default { command, execute }
