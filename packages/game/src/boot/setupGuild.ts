import { Client, Guild } from 'discord.js'

import {
  announceGoldGained,
  announceStatContested,
  announceXpAwarded,
} from '@adventure-bot/game/announcements'
import { announcePeriodicEffects } from '@adventure-bot/game/announcements/announcePeriodicEffects'
import { installCommands } from '@adventure-bot/game/boot/installCommands'
import { renderCharacterList } from '@adventure-bot/game/character'
import { renderLeaderboard } from '@adventure-bot/game/leaderboard'
import { renderRoamingMonsters } from '@adventure-bot/game/roamingMonsters/renderRoamingMonsters'

import { gameChannel } from './gameChannel'

export async function setupGuild({
  guild,
  client,
}: {
  guild: Guild
  client: Client
}): Promise<void> {
  const appId = client.application?.id
  if (!appId) return

  const { BOT_TOKEN, CLIENT_ID } = process.env
  if (BOT_TOKEN && CLIENT_ID)
    installCommands({
      token: BOT_TOKEN,
      clientId: CLIENT_ID,
      guildId: guild.id,
    })
  renderCharacterList({ guild, appId })
  gameChannel({ guild, appId }).then((channel) => {
    announceXpAwarded({ channel })
    announceGoldGained({ channel })
    announcePeriodicEffects({ channel })
    announceStatContested({ channel })
  })
  renderLeaderboard({ guild, appId })
  renderRoamingMonsters({ guild, appId })
}
