import { compose } from '@reduxjs/toolkit'
import { Client, Guild } from 'discord.js'

import { renderCharacterList } from '@adventure-bot/game/character'
import {
  findOrCreateCategory,
  findOrCreateTextChannelByName,
} from '@adventure-bot/game/guild'
import { findOrCreateLeaderboardChannel } from '@adventure-bot/game/leaderboard/findOrCreateLeaderboardChannel'
import store from '@adventure-bot/game/store'
import { channelCreated } from '@adventure-bot/game/store/slices/channels'

const { dispatch } = store

export async function setupGuild({
  guild,
  client,
}: {
  guild: Guild
  client: Client
}): Promise<void> {
  const category = await findOrCreateCategory(guild, 'Adventure Bot')
  await findOrCreateTextChannelByName({
    guild,
    name: 'game',
    options: { parent: category.id },
    onCreate: compose(dispatch, channelCreated),
  })
  renderCharacterList(guild)
  const appId = client.application?.id
  if (!appId) return
  findOrCreateLeaderboardChannel(guild, appId)

  guild.channels.cache.forEach((channel) => {
    if (channel.isText()) return
    console.log(`channel ${channel.name}`)
  })
}
