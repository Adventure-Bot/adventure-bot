import { Client } from 'discord.js'

import {
  createClient,
  gameClock,
  waitForWinner,
} from '@adventure-bot/game/boot'

let client: Client | undefined

export const getClient: () => Client | undefined = () => client

export const startGameService: (gameOptions: {
  clientId: string
  token: string
  channelId: string
}) => void = async ({ clientId, token, channelId }) => {
  createClient({
    type: 'discord',
    token,
    clientId,
    channelId,
    onError: (e) => console.error('Discord client error!', e),

    onReady: (client) => {
      gameClock()
      waitForWinner(client)
    },
  }).then((c) => (client = c))
}
