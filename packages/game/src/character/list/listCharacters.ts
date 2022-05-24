import { Guild, Message } from 'discord.js'

import {
  getUserCharacters,
  limitedCharacterEmbed,
} from '@adventure-bot/game/character'
import store from '@adventure-bot/game/store'
import { characterMessageCreated } from '@adventure-bot/game/store/actions'

import { charactersChannel } from './charactersChannel'

export async function listCharacters({
  guild,
  appId,
}: {
  guild: Guild
  appId: string
}): Promise<(void | Message<boolean>)[] | undefined> {
  const channel = await charactersChannel({ guild, appId })
  const messages = await channel.messages.fetch()
  const { messageIdsByCharacterId } = store.getState().characterList
  return Promise.all(
    getUserCharacters()
      .filter((character) => character.xp > 0)
      .sort((a, b) => b.xp - a.xp)
      .map((character) => {
        const embeds = [limitedCharacterEmbed({ character })]
        const message = messages.get(messageIdsByCharacterId[character.id])
        return message
          ? message.edit({ embeds })
          : channel.send({ embeds }).then((message) => {
              store.dispatch(characterMessageCreated({ character, message }))
            })
      })
  )
}
