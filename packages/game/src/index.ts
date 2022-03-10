import { Client } from 'discord.js'

import { createClient } from '@adventure-bot/game/boot'
import { declareWinners } from '@adventure-bot/game/crown/declareWinners'
import { assertEnv } from '@adventure-bot/game/env'

assertEnv()

let client: Client | undefined

export const getClient: () => Client | undefined = () => client

createClient({
  type: 'discord',
  clientId: String(process.env.CLIENT_ID),
  channelId: String(process.env.GUILD_ID),
  token: String(process.env.BOT_TOKEN),
  onError: (e) => console.error('Discord client error!', e),

  onReady: (client) => {
    declareWinners(client)
  },
}).then((c) => (client = c))
