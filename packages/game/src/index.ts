import { Client } from 'discord.js'

import {
  announceCrownLoots,
  announceEffectAdded,
  announceItemsReceived,
  announceLoots,
  announceTrapAttacked,
  announceWinners,
} from '@adventure-bot/game/announcements'
import { createClient } from '@adventure-bot/game/boot'
import { renderCharacterList } from '@adventure-bot/game/character'
import { assertEnv } from '@adventure-bot/game/env'
import { dispatchScheduledActions } from '@adventure-bot/game/store/schedule/dispatchScheduledActions'

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
    announceWinners(client)
    announceItemsReceived()
    announceEffectAdded(client)
    announceCrownLoots(client)
    announceLoots(client)
    renderCharacterList(client)
    announceTrapAttacked(client)
    dispatchScheduledActions()
  },
}).then((c) => (client = c))
