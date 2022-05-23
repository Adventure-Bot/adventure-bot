import { Client } from 'discord.js'

import { createClient } from '@adventure-bot/game/boot/createClient'
import { assertEnv } from '@adventure-bot/game/env'

assertEnv()

let client: Client | undefined

export const getClient: () => Client | undefined = () => client

createClient({
  token: String(process.env.BOT_TOKEN),
  onError: (e) => console.error('Discord client error!', e),
}).then((c) => (client = c))
