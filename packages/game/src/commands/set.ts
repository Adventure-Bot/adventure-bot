import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction } from 'discord.js'
import { URL } from 'url'

import { execute as inspect } from '@adventure-bot/commands/inspect/inspect'
import store from '@adventure-bot/store'
import { profileSet } from '@adventure-bot/store/slices/characters'

export const command = new SlashCommandBuilder()
  .setName('set')
  .setDescription('Configure your character')
  .addStringOption((option) =>
    option
      .setName('profile')
      .setDescription(`Set your character's profile picture.`)
      .setRequired(true)
  )

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const profile = interaction.options.data[0].value?.toString()
  if (!profile) return

  try {
    const url = new URL(profile)
    const validExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp']
    const isValidExtension = (path: string) =>
      new RegExp(`${validExtensions.join('|')}$`).test(path)
    if (!isValidExtension(url.pathname)) {
      interaction.editReply(
        [
          `\`${profile}\` must be a one of these valid extensions: ${validExtensions.join(
            ', '
          )}`,
          'Example:',
          '`/set profile:https://www.example.com/profile.png`',
          'Please try again.',
        ].join('\n')
      )
      return
    }
  } catch (e) {
    interaction.editReply(
      [
        `\`${profile}\` must be a valid URL.`,
        'Example:',
        '`/set profile:https://www.example.com/profile.png`',
        'Please try again.',
      ].join('\n')
    )
    return
  }

  store.dispatch(
    profileSet({
      characterId: interaction.user.id,
      profile,
    })
  )

  await inspect(interaction)
}

export default { command, execute }
