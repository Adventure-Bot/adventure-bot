import { Client, Message } from 'discord.js'

import {
  getUserCharacters,
  limitedCharacterEmbed,
} from '@adventure-bot/game/character'
import store from '@adventure-bot/game/store'
import { characterMessageCreated } from '@adventure-bot/game/store/actions'

import { findOrCreateCharacterListThread } from './findOrCreateCharacterListThread'

export async function listCharacters(client: Client): Promise<void> {
  const thread = await findOrCreateCharacterListThread(client)
  if (!thread) return
  const { messageIdsByCharacterId } = store.getState().characterList
  const messages = await thread.messages.fetch()
  if (thread.archived) await thread.setArchived(false)
  getUserCharacters()
    .filter((character) => character.xp > 0)
    .sort((a, b) => b.xp - a.xp)
    .map(async (character) => {
      if (!messageIdsByCharacterId[character.id]) {
        const message = await thread.send({
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
        const message = messages.find(
          (message) => message.id === messageIdsByCharacterId[character.id]
        )
        if (!(message instanceof Message)) return
        await message.edit({
          embeds: [limitedCharacterEmbed({ character })],
        })
      }
    })
}
