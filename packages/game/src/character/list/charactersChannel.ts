import { Guild, TextChannel } from 'discord.js'

import {
  findOrCreateCategory,
  findOrCreateTextChannelByName,
} from '@adventure-bot/game/guild'

export async function charactersChannel({
  guild,
  appId,
}: {
  guild: Guild
  appId: string
}): Promise<TextChannel> {
  return findOrCreateTextChannelByName({
    guild,
    name: 'characters',
    options: {
      position: 1,
      topic: `Your fellow adventurers.`,
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
