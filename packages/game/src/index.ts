import { Client } from 'discord.js'
import dotenv from 'dotenv'
import workspace from 'find-yarn-workspace-root'
import path from 'path'

import {
  assertEnv,
  createClient,
  gameClock,
  waitForWinner,
} from '@adventure-bot/game/boot'

dotenv.config({
  path: path.join(workspace() ?? process.cwd(), '.env'),
})

let client: Client

const startGameService: (gameOptions: {
  clientId: string
  token: string
  channelId: string
}) => ReturnType<typeof createClient> = async ({
  clientId,
  token,
  channelId,
}) =>
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
  })

assertEnv()

startGameService({
  clientId: String(process.env.CLIENT_ID),
  token: String(process.env.token),
  channelId: String(process.env.GUILD_ID),
}).then((c) => {
  client = c
})

export { client }
