import { Guild, TextChannel } from 'discord.js'

import {
  findOrCreateCategory,
  findOrCreateTextChannelByName,
} from '@adventure-bot/game/guild'

export async function gameChannel({
  guild,
}: {
  guild: Guild
}): Promise<TextChannel> {
  return findOrCreateTextChannelByName({
    guild,
    name: 'game',
    options: {
      parent: (await findOrCreateCategory(guild, 'Adventure Bot')).id,
    },
  })
}
