import { SlashCommandBuilder } from '@discordjs/builders'
import { MessageAttachment, Permissions } from 'discord.js'

import { DB_FILE } from '@adventure-bot/game/fixtures'
import {
  CommandHandler,
  CommandHandlerOptions,
} from '@adventure-bot/game/utils'

export const command = new SlashCommandBuilder()
  .setName('db')
  .setDescription('Database Administration')
  .addSubcommand((option) =>
    option.setName('dump').setDescription('Dump the database to screen.')
  )
  .addSubcommand((option) =>
    option.setName('save').setDescription('Save the database to disk.')
  )

const subcommands = new Map<string, CommandHandler>()

subcommands.set('dump', async ({ interaction }: CommandHandlerOptions) => {
  if (!interaction.memberPermissions?.has(Permissions.FLAGS.ADMINISTRATOR)) {
    await interaction.editReply('Admin required.')
    return
  }
  await interaction.editReply({
    files: [new MessageAttachment(DB_FILE)],
  })
})

export const execute = async ({
  interaction,
}: CommandHandlerOptions): Promise<void> => {
  const command = subcommands.get(interaction.options.getSubcommand(true))
  if (!command) {
    await interaction.editReply(`Unknown command ${command}`)
    return
  }
  await command({ interaction })
}

export default { command, execute }
