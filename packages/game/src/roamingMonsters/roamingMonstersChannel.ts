import { Guild, TextChannel } from 'discord.js'

import {
  findOrCreateCategory,
  findOrCreateTextChannelByName,
} from '@adventure-bot/game/guild'

export async function roamingMonstersChannel({
  guild,
  appId,
}: {
  guild: Guild
  appId: string
}): Promise<TextChannel> {
  return findOrCreateTextChannelByName({
    name: 'roaming-monsters',
    guild,
    options: {
      topic: `Monsters seen in the area.`,
      position: 2,
      parent: (await findOrCreateCategory(guild, 'Adventure Bot')).id,
      permissionOverwrites: [
        {
          id: guild.id,
          allow: ['VIEW_CHANNEL'],
          deny: [
            'SEND_MESSAGES',
            'ADD_REACTIONS',
            'USE_APPLICATION_COMMANDS',
            'CREATE_PUBLIC_THREADS',
          ],
        },
        { id: appId, allow: ['SEND_MESSAGES'], deny: [] },
      ],
    },
  })
}
