import { SlashCommandBuilder } from '@discordjs/builders'

import store from '@adventure-bot/game/store'
import { cleansed } from '@adventure-bot/game/store/slices/characters'
import { CommandHandlerOptions } from '@adventure-bot/game/utils'

export const command = new SlashCommandBuilder()
  .setName('cleanse')
  .setDescription('Remove all effects.')

export const execute = async ({
  interaction,
}: CommandHandlerOptions): Promise<void> => {
  store.dispatch(cleansed({ characterId: interaction.user.id }))
  interaction.followUp(`${interaction.user.username} cleansed themself`)
}

export default { command, execute }
