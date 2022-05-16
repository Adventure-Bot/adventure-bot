import { Guild, Message } from 'discord.js'

import {
  getUserCharacters,
  limitedCharacterEmbed,
} from '@adventure-bot/game/character'
import { getClient } from '@adventure-bot/game/index'
import store from '@adventure-bot/game/store'
import { characterMessageCreated } from '@adventure-bot/game/store/actions'

import { findOrCreateCharacterList } from './findOrCreateCharacterList'

export async function listCharacters(guild: Guild): Promise<void> {
  const appId = getClient()?.application?.id
  if (!appId) return
  const channel = await findOrCreateCharacterList(guild, appId)
  const { messageIdsByCharacterId } = store.getState().characterList
  const characters = getUserCharacters()
  if (!characters.length) return
  characters
    .filter((character) => character.xp > 0)
    .sort((a, b) => b.xp - a.xp)
    .forEach(async (character) => {
      if (!messageIdsByCharacterId[character.id]) {
        const message = await channel.send({
          embeds: [limitedCharacterEmbed({ character })],
        })
        if (!(message instanceof Message)) return
        store.dispatch(
          characterMessageCreated({
            character,
            message,
          })
        )
      } else {
        const message = channel.messages.cache.find(
          (message) => message.id === messageIdsByCharacterId[character.id]
        )
        if (!(message instanceof Message)) return
        await message.edit({
          embeds: [limitedCharacterEmbed({ character })],
        })
      }
    })
}
