import { SlashCommandBuilder } from 'discord.js'

import store from '@adventure-bot/game/store'
import { characterCleansed } from '@adventure-bot/game/store/slices/statusEffects'
import { CommandHandlerOptions } from '@adventure-bot/game/utils'

export const command = new SlashCommandBuilder()
  .setName('cleanse')
  .setDescription('Remove all effects.')

export const execute = async ({
  interaction,
}: CommandHandlerOptions): Promise<void> => {
  store.dispatch(characterCleansed({ characterId: interaction.user.id }))
  interaction.followUp(`${interaction.user.username} cleansed themself`)
}

export default { command, execute }
