import { createAction } from '@reduxjs/toolkit'
import { Guild, TextChannel } from 'discord.js'

import {
  findOrCreateCategory,
  findOrCreateTextChannel,
} from '@adventure-bot/game/guild'
import store from '@adventure-bot/game/store'

const leaderboardCreated = createAction<TextChannel>('leaderboardCreated')

export async function findOrCreateLeaderboardChannel(
  guild: Guild,
  appId: string
): Promise<TextChannel> {
  const category = await findOrCreateCategory(guild, 'Adventure Bot')
  const characterList = await findOrCreateTextChannel({
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
      store.dispatch(leaderboardCreated(channel))
    },
  })
  return characterList
}
