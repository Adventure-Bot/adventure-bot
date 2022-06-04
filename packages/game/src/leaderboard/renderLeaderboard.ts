import { Guild } from 'discord.js'

import {
  leaderboardChannel,
  leaderboardEmbeds,
} from '@adventure-bot/game/leaderboard'
import { winnerDeclared } from '@adventure-bot/game/store/actions'
import { startAppListening } from '@adventure-bot/game/store/listenerMiddleware'

export async function renderLeaderboard({
  appId,
  guild,
}: {
  guild: Guild
  appId: string
}): Promise<void> {
  const embeds = leaderboardEmbeds()
  const channel = await leaderboardChannel({ appId, guild })
  const message =
    (await channel.messages.fetch()).first() ?? (await channel.send({ embeds }))
  await message.edit({ embeds: leaderboardEmbeds() })
  startAppListening({
    actionCreator: winnerDeclared,
    effect: () => {
      message.edit({ embeds: leaderboardEmbeds() })
    },
  })
}
