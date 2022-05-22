import { createAction } from '@reduxjs/toolkit'
import { Client, Guild, TextChannel } from 'discord.js'

import { renderCharacterList } from '@adventure-bot/game/character'
import {
  findOrCreateCategory,
  findOrCreateTextChannel,
} from '@adventure-bot/game/guild'
import { findOrCreateLeaderboardChannel } from '@adventure-bot/game/leaderboard/findOrCreateLeaderboardChannel'
import store from '@adventure-bot/game/store'

export const gameChannelCreated =
  createAction<TextChannel>('gameChannelCreated')

export async function setupGuild({
  guild,
  client,
}: {
  guild: Guild
  client: Client
}): Promise<void> {
  const category = await findOrCreateCategory(guild, 'Adventure Bot')
  const gameChannel = await findOrCreateTextChannel({
    guild,
    name: 'game',
    options: { parent: category.id },
  })
  store.dispatch(gameChannelCreated(gameChannel))
  renderCharacterList(guild)
  const appId = client.application?.id
  if (!appId) return
  findOrCreateLeaderboardChannel(guild, appId)

  guild.channels.cache.forEach((channel) => {
    if (channel.isText()) return
    console.log(`channel ${channel.name}`)
  })
}
