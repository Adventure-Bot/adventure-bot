import { ChannelType, Client, TextChannel } from 'discord.js'

import store from '@adventure-bot/game/store'
import { selectLastChannelUsed } from '@adventure-bot/game/store/selectors'

export function getLastChannelUsed(client: Client): TextChannel | undefined {
  const state = store.getState()
  const lastChannelId = selectLastChannelUsed(state)
  const channel = client.channels.cache.get(lastChannelId)
  if (channel?.type === ChannelType.GuildText) return channel
}
