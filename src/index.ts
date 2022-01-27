import { diff } from 'deep-object-diff'
import { Client } from 'discord.js'

import {
  assertEnv,
  createClient,
  gameClock,
  waitForWinner,
} from '@adventure-bot/game'
import { ReduxState } from '@adventure-bot/store'

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

  let lastState: ReduxState

  return createClient({
    type: 'discord',
    token,
    clientId,
    channelId,
    onBeforeInteraction: async (gameState) => {
      // Keep track of what the game state is prior to the users interaction
      lastState = gameState
    },
    onAfterInteraction: async (gameState) => {
      const didStateChange = Boolean(
        Object.keys(diff(lastState, gameState)).length
      )
      if (didStateChange) {
        // Persist to DB
      }
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
