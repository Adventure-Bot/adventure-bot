import { Client, Guild } from 'discord.js'

import {
  announceCooldowns,
  announceEffectAdded,
  announceEffectRemoved,
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
    announceCooldowns(channel)
    announceEffectAdded(channel)
    announceEffectRemoved(channel)
    announceGoldGained(channel)
    announceGoldStolen(channel)
    announceHealed(channel)
    announcePeriodicEffects(channel)
    announceQuestProgress(channel)
    announceStatContested(channel)
    announceTrapAttacked(channel)
    announceWinners(channel)
    announceXpAwarded(channel)
  })
  renderRoamingMonsters({ guild, appId })
}
