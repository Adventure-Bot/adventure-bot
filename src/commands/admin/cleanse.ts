import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import store from '@adventure-bot/store'
import { cleansed } from '@adventure-bot/store/slices/characters'

export const command = new SlashCommandBuilder()
  .setName('cleanse')
  .setDescription('Remove all effects.')

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  store.dispatch(cleansed({ characterId: interaction.user.id }))
  interaction.followUp(`${interaction.user.username} cleansed themself`)
}

export default { command, execute }
