import { Client, Guild } from 'discord.js'

import { installCommands } from '@adventure-bot/game/boot/installCommands'
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
  const appId = client.application?.id
  if (!appId) return
  renderCharacterList({ guild, appId })

  const { BOT_TOKEN, CLIENT_ID } = process.env
  if (BOT_TOKEN && CLIENT_ID)
    installCommands({
      token: BOT_TOKEN,
      clientId: CLIENT_ID,
      guildId: guild.id,
    })
  gameChannel({ guild, appId })
  leaderboardChannel({ guild, appId })
}
