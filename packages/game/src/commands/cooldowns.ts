import { SlashCommandBuilder } from '@discordjs/builders'

import { findOrCreateCharacter } from '@adventure-bot/game/character'
import { cooldownsEmbed } from '@adventure-bot/game/commands/inspect/cooldownsEmbed'
import store from '@adventure-bot/game/store'
import { selectCharacterById } from '@adventure-bot/game/store/selectors'
import { CommandHandlerOptions } from '@adventure-bot/game/utils'

export const command = new SlashCommandBuilder()
  .setName('cooldowns')
  .setDescription('Check your cooldowns.')

export const execute = async ({
  interaction,
}: CommandHandlerOptions): Promise<void> => {
  findOrCreateCharacter(interaction.user)
  const character = selectCharacterById(store.getState(), interaction.user.id)
  if (!character) return
  await interaction.editReply({
    embeds: [cooldownsEmbed({ character, interaction })],
  })
}

export default { command, execute }
