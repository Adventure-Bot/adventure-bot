import { Guild, TextChannel } from 'discord.js'

import { characterListCreated } from '@adventure-bot/game/character/list/characterListCreated'
import {
  findOrCreateCategory,
  findOrCreateTextChannelByName,
} from '@adventure-bot/game/guild'
import store from '@adventure-bot/game/store'

export async function findOrCreateCharacterList(
  guild: Guild,
  appId: string
): Promise<TextChannel> {
  const category = await findOrCreateCategory(guild, 'Adventure Bot')
  const characterList = await findOrCreateTextChannelByName({
    guild,
    name: 'characters',
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
      store.dispatch(characterListCreated(channel))
    },
  })
  return characterList
}
