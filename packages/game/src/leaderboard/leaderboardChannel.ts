import { Guild, TextChannel } from 'discord.js'

import {
  findOrCreateCategory,
  findOrCreateTextChannelByName,
} from '@adventure-bot/game/guild'

export async function leaderboardChannel({
  guild,
  appId,
}: {
  guild: Guild
  appId: string
}): Promise<TextChannel> {
  return findOrCreateTextChannelByName({
    guild,
    name: 'leaderboard',
    options: {
      parent: (await findOrCreateCategory(guild, 'Adventure Bot')).id,
      permissionOverwrites: [
        {
          id: guild.id,
          allow: ['VIEW_CHANNEL'],
          deny: ['SEND_MESSAGES', 'ADD_REACTIONS', 'USE_APPLICATION_COMMANDS'],
        },
        { id: appId, allow: ['SEND_MESSAGES'], deny: [] },
      ],
    },
  })
}
