import { ChannelType, SlashCommandBuilder } from 'discord.js'

import { findOrCreateCharacter } from '@adventure-bot/game/character'
import inspect from '@adventure-bot/game/commands/inspect/inspect'
import store from '@adventure-bot/game/store'
import { profileSet } from '@adventure-bot/game/store/slices/characters'
import { CommandHandlerOptions } from '@adventure-bot/game/utils'

export const command = new SlashCommandBuilder()
  .setName('set_profile')
  .setDescription('Change your character profile picture.')

export const execute = async ({
  interaction,
}: CommandHandlerOptions): Promise<void> => {
  const character = findOrCreateCharacter(interaction.user)
  const channel = interaction.channel
  if (!channel) return
  const collector = channel.createMessageCollector({
    filter: (m) => m.author.id === interaction.user.id,
    time: 60000,
    max: 1,
  })

  collector.on('collect', async (message) => {
    if (message.author.bot) return
    if (message.channel.type !== ChannelType.GuildText) return
    const profile = message.attachments.first()?.url
    if (!profile) return
    store.dispatch(
      profileSet({
        characterId: character.id,
        profile,
      })
    )
    await channel.send('Done!')
    await inspect.execute({ interaction })
  })
  channel.send("Ok, upload a new picture and I'll update it for you!")
}

export default { command, execute }
