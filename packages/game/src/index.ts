import { Client } from 'discord.js'

import {
  announceCrownLoots,
  announceEffectAdded,
  announceItemsReceived,
  announceLoots,
  announceTrapAttacked,
  declareGameWon,
} from '@adventure-bot/game/announcements'
import { createClient } from '@adventure-bot/game/boot'
import { renderCharacterList } from '@adventure-bot/game/character'
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
    declareGameWon(client)
    announceItemsReceived()
    announceEffectAdded(client)
    announceCrownLoots(client)
    announceLoots(client)
    renderCharacterList(client)
    announceTrapAttacked(client)
  },
}).then((c) => (client = c))
