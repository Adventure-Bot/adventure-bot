import { Client, Guild } from 'discord.js'

import { installCommands } from '@adventure-bot/game/boot/installCommands'
import { renderCharacterList } from '@adventure-bot/game/character'
import { renderLeaderboard } from '@adventure-bot/game/character/list/renderLeaderboard'

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
  await renderCharacterList({ guild, appId })
  await gameChannel({ guild, appId })
  await renderLeaderboard({ guild, appId })
}
