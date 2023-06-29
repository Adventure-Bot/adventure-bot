import { SlashCommandBuilder } from 'discord.js'
import { URL } from 'url'

import { findOrCreateCharacter } from '@adventure-bot/game/character'
import { execute as inspect } from '@adventure-bot/game/commands/inspect/inspect'
import store from '@adventure-bot/game/store'
import { profileSet } from '@adventure-bot/game/store/slices/characters'
import { CommandHandlerOptions } from '@adventure-bot/game/utils'

export const command = new SlashCommandBuilder()
  .setName('set')
  .setDescription('Configure your character')
  .addStringOption((option) =>
    option
      .setName('profile')
      .setDescription(`Set your character's profile picture.`)
      .setRequired(true)
  )

export const execute = async ({
  interaction,
}: CommandHandlerOptions): Promise<void> => {
  const profile = interaction.options.data[0].value?.toString()
  if (!profile) return
  findOrCreateCharacter(interaction.user) // ensure the user has a character

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

  await inspect({ interaction })
}

export default { command, execute }
