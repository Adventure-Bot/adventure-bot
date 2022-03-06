import { Client, TextChannel, ThreadChannel } from 'discord.js'

import store from '@adventure-bot/game/store'
import { characterListThreadCreated } from '@adventure-bot/game/store/actions'
import { selectLastChannelUsed } from '@adventure-bot/game/store/selectors'

export async function findOrCreateCharacterListThread(
  client: Client
): Promise<ThreadChannel | void> {
  const channel = client.channels.cache.get(
    selectLastChannelUsed(store.getState())
  )
  if (!(channel instanceof TextChannel)) return
  const threadId = store.getState().characterList.threadId
  const existingThread = channel.threads.cache.find(
    (thread) => thread.id === threadId
  )
  if (existingThread) return existingThread
  const thread = await channel.threads.create({
    name: 'Characters',
  })
  store.dispatch(characterListThreadCreated(thread))
  return thread
}
