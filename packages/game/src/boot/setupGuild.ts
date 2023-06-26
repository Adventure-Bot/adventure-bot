import { Client, Guild } from 'discord.js'

import {
  announceEffectAdded,
  announceGoldGained,
  announceGoldStolen,
  announceHealed,
  announcePeriodicEffects,
  announceQuestProgress,
  announceStatContested,
  announceTrapAttacked,
  announceWinners,
  announceXpAwarded,
} from '@adventure-bot/game/announcements'
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
    announceEffectAdded(channel)
    announceGoldGained(channel)
    announceGoldStolen(channel)
    announcePeriodicEffects(channel)
    announceQuestProgress(channel)
    announceStatContested(channel)
    announceTrapAttacked(channel)
    announceXpAwarded(channel)
    announceHealed(channel)
    announceWinners(channel)
  })
  renderLeaderboard({ guild, appId })
  renderRoamingMonsters({ guild, appId })
}
