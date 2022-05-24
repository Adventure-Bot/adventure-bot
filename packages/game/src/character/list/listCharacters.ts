import { Guild, Message } from 'discord.js'

import {
  getUserCharacters,
  limitedCharacterEmbed,
} from '@adventure-bot/game/character'
import { getClient } from '@adventure-bot/game/index'

import { charactersChannel } from './charactersChannel'

export async function listCharacters(guild: Guild): Promise<void> {
  const client = getClient()
  const appId = client?.application?.id
  if (!appId) return
  const channel = await charactersChannel({ guild, appId })
  const characters = getUserCharacters()
  if (!characters.length) return

  characters
    .filter((character) => character.xp > 0)
    .sort((a, b) => b.xp - a.xp)
    .map(async (character) => {
      const embeds = [limitedCharacterEmbed({ character })]
      const message = channel.messages.cache.find(
        (message) => message.embeds[0].title === embeds[0].title
      )
      return message instanceof Message
        ? message.edit({
            embeds,
          })
        : channel.send({
            embeds,
          })
    })
}
