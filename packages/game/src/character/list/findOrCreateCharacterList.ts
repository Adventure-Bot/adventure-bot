import { Guild, TextChannel } from 'discord.js'

import {
  findOrCreateCategory,
  findOrCreateTextChannel,
} from '@adventure-bot/game/guild'
import store from '@adventure-bot/game/store'
import { characterListCreated } from '@adventure-bot/game/store/actions'

export async function findOrCreateCharacterList(
  guild: Guild,
  appId: string
): Promise<TextChannel> {
  const category = await findOrCreateCategory(guild, 'Adventure Bot')
  const characterList = await findOrCreateTextChannel({
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
  })
  store.dispatch(characterListCreated(characterList))
  return characterList
}
