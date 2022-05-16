import { Guild, GuildChannelCreateOptions, TextChannel } from 'discord.js'

export async function findOrCreateTextChannel({
  guild,
  name,
  options,
  onCreate,
}: {
  guild: Guild
  name: string
  options?: GuildChannelCreateOptions
  onCreate?: (channel: TextChannel) => void
}): Promise<TextChannel> {
  const channel = guild.channels.cache.find((channel) => channel.name === name)
  if (channel instanceof TextChannel) return channel

  const newChannel = await guild.channels.create(name, {
    ...options,
    type: 'GUILD_TEXT',
  })
  onCreate ? onCreate(newChannel) : null
  return newChannel
}
