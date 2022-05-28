import { Collection, Guild, Message } from 'discord.js'
import { mapValues, values } from 'remeda'

import {
  getUserCharacters,
  limitedCharacterEmbed,
} from '@adventure-bot/game/character'
import store from '@adventure-bot/game/store'
import {
  characterMessageCreated,
  characterMessageDeleted,
} from '@adventure-bot/game/store/actions'

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
  const { characterMessages } = store.getState()
  const guildMessages = characterMessages[guild.id] || []
  console.time('purgeDeletedMessages')
  purgeDeletedMessages({ messages, guildMessages, guild })
  console.timeEnd('purgeDeletedMessages')
  console.time('deleteMissingMessages')
  await deleteMissingMessages({ messages, guildMessages })
  console.timeEnd('deleteMissingMessages')
  return Promise.all(
    getUserCharacters()
      .sort((a, b) => b.xp - a.xp)
      .map((character) => {
        const embeds = [limitedCharacterEmbed({ character })]
        const message = messages.get(guildMessages[character.id])
        return message
          ? message.edit({ embeds })
          : channel.send({ embeds }).then((message) => {
              store.dispatch(
                characterMessageCreated({ character, message, guild })
              )
            })
      })
  )
}
async function deleteMissingMessages({
  messages,
  guildMessages,
}: {
  messages: Collection<string, Message<boolean>>
  guildMessages: Record<string, string>
}) {
  await Promise.all(
    messages.map(async (message) => {
      if (!values(guildMessages).includes(message.id)) {
        await message.delete()
      }
    })
  )
}

function purgeDeletedMessages({
  guildMessages,
  messages,
  guild,
}: {
  guildMessages: Record<string, string>
  messages: Collection<string, Message<boolean>>
  guild: Guild
}) {
  mapValues(guildMessages, (characterId, messageId) =>
    messages.get(messageId)
      ? null
      : store.dispatch(
          characterMessageDeleted({ messageId, guildId: guild.id, characterId })
        )
  )
}
