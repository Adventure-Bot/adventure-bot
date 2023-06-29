import {
  ChannelType,
  Guild,
  GuildChannelCreateOptions,
  TextChannel,
} from 'discord.js'

export async function findOrCreateTextChannelByName({
  guild,
  name,
  options,
}: {
  guild: Guild
  name: string
  options?: Omit<GuildChannelCreateOptions, 'name'>
}): Promise<TextChannel> {
  const channel = guild.channels.cache.find((channel) => channel.name === name)
  if (channel instanceof TextChannel) return channel

  return guild.channels.create({
    ...options,
    name,
    type: ChannelType.GuildText,
  })
}
