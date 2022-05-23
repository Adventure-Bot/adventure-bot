import { Guild, GuildChannelCreateOptions, TextChannel } from 'discord.js'

export async function findOrCreateTextChannelByName({
  guild,
  name,
  options,
}: {
  guild: Guild
  name: string
  options?: GuildChannelCreateOptions
}): Promise<TextChannel> {
  const channel = guild.channels.cache.find((channel) => channel.name === name)
  if (channel instanceof TextChannel) return channel

  return guild.channels.create(name, {
    ...options,
    type: 'GUILD_TEXT',
  })
}
