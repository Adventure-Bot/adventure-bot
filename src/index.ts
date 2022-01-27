import { Client } from 'discord.js'

import {
  assertEnv,
  createClient,
  gameClock,
  waitForWinner,
} from '@adventure-bot/game'

let client: Client

const startGame: (gameOptions: {
  clientId: string
  token: string
  channelId: string
}) => ReturnType<typeof createClient> = async ({
  clientId,
  token,
  channelId,
}) => {
  assertEnv()

  return createClient({
    type: 'discord',
    token,
    clientId,
    channelId,
    onBeforeInteraction: async (gameState) => {
      console.log('before', gameState)
    },
    onAfterInteraction: async (gameState) => {
      console.log('after', gameState)
    },
    onError: (e) => console.error('Discord client error!', e),

    onReady: (client) => {
      gameClock()
      waitForWinner(client)
    },
  })
}

startGame({
  clientId: String(process.env.CLIENT_ID),
  token: String(process.env.token),
  channelId: String(process.env.GUILD_ID),
}).then((c) => {
  client = c
})

export { client }
