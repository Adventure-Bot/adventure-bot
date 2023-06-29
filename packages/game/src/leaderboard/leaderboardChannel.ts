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
    name: 'leaderboard',
    guild,
    options: {
      topic: `The legends.`,
      position: 3,
      parent: (await findOrCreateCategory(guild, 'Adventure Bot')).id,
      permissionOverwrites: [
        {
          id: guild.id,
          allow: ['ViewChannel'],
          deny: [
            'SendMessages',
            'AddReactions',
            'UseApplicationCommands',
            'CreatePublicThreads',
          ],
        },
        { id: appId, allow: ['SendMessages'], deny: [] },
      ],
    },
  })
}
