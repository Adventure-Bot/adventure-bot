import { Guild, TextChannel } from 'discord.js'

import {
  findOrCreateCategory,
  findOrCreateTextChannelByName,
} from '@adventure-bot/game/guild'
import store from '@adventure-bot/game/store'
import { channelCreated } from '@adventure-bot/game/store/slices/channels'

import { leaderboardCreated } from './leaderboardCreated'

export async function findOrCreateLeaderboardChannel(
  guild: Guild,
  appId: string
): Promise<TextChannel> {
  const channelId = store.getState().channels.channelIdsByName['leaderboard']

  const existingChannel = guild.channels.cache.get(channelId)
  if (existingChannel instanceof TextChannel) return existingChannel
  const category = await findOrCreateCategory(guild, 'Adventure Bot')
  const characterList = await findOrCreateTextChannelByName({
    guild,
    name: 'leaderboard',
    options: {
      parent: category.id,
      permissionOverwrites: [
        {
          id: guild.id,
          allow: ['VIEW_CHANNEL'],
          deny: ['SEND_MESSAGES', 'ADD_REACTIONS', 'USE_APPLICATION_COMMANDS'],
        },
        { id: appId, allow: ['SEND_MESSAGES'], deny: [] },
      ],
    },
    onCreate: (channel) => {
      store.dispatch(channelCreated(channel))
      store.dispatch(leaderboardCreated(channel))
    },
  })
  return characterList
}
