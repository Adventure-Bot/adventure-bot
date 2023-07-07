import { EmbedBuilder, Message, TextChannel } from 'discord.js'

// todo: remove this no longer helpful abstraction
export async function sendEmbeds({
  channel,
  embeds,
}: {
  channel: TextChannel
  embeds: EmbedBuilder[]
  messageId?: string
}): Promise<Message> {
  return channel.send({ embeds })
}
