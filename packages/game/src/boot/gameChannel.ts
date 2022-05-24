import { Guild, TextChannel } from 'discord.js'

import {
  findOrCreateCategory,
  findOrCreateTextChannelByName,
} from '@adventure-bot/game/guild'

export async function gameChannel({
  guild,
  appId,
}: {
  guild: Guild
  appId: string
}): Promise<TextChannel> {
  return findOrCreateTextChannelByName({
    guild,
    name: 'game',
    options: {
      position: 0,
      topic: 'Your /adventure awaits.',
      parent: (await findOrCreateCategory(guild, 'Adventure Bot')).id,
      permissionOverwrites: [
        {
          id: appId,
          allow: ['USE_APPLICATION_COMMANDS'],
        },
      ],
    },
  })
}
