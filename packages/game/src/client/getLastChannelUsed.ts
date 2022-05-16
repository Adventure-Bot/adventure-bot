import { Client, TextBasedChannels } from 'discord.js'

import store from '@adventure-bot/game/store'
import { selectLastChannelUsed } from '@adventure-bot/game/store/selectors'

export function getLastChannelUsed(
  client: Client
): TextBasedChannels | undefined {
  const state = store.getState()
  const lastChannelId = selectLastChannelUsed(state)
  const channel = client.channels.cache.get(lastChannelId)
  if (channel?.isText()) return channel
}
