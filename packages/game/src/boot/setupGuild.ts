import { Client, Guild } from 'discord.js'

import { renderCharacterList } from '@adventure-bot/game/character'
import { leaderboardChannel } from '@adventure-bot/game/leaderboard'

import { gameChannel } from './gameChannel'

export async function setupGuild({
  guild,
  client,
}: {
  guild: Guild
  client: Client
}): Promise<void> {
  renderCharacterList(guild)
  const appId = client.application?.id
  if (!appId) return
  gameChannel({ guild, appId })
  leaderboardChannel({ guild, appId })
}
