import { EmbedBuilder, Message, TextChannel } from 'discord.js'

export async function sendEmbeds({
  messageId,
  channel,
  embeds,
}: {
  channel: TextChannel
  embeds: EmbedBuilder[]
  messageId?: string
}): Promise<Message> {
  const message = messageId
    ? await channel.messages.fetch(messageId).catch(() => null)
    : null

  if (message) {
    return message.reply({ embeds })
  } else {
    return channel.send({ embeds })
  }
}
