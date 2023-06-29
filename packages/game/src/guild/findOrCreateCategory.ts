import { ChannelType, Guild, GuildChannel, ThreadChannel } from 'discord.js'

export async function findOrCreateCategory(
  guild: Guild,
  name: string
): Promise<GuildChannel | ThreadChannel> {
  const category = guild.channels.cache.find(
    (channel) =>
      channel.type === ChannelType.GuildCategory && channel.name === name
  )
  if (category) return category
  return guild.channels.create({ name, type: ChannelType.GuildCategory })
}
