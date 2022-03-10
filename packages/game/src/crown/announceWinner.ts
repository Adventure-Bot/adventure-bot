import { Client } from 'discord.js'

import { Character, decoratedName } from '@adventure-bot/game/character'
import { leaderboard } from '@adventure-bot/game/commands/leaderboard'
import store from '@adventure-bot/game/store'
import { selectLastChannelUsed } from '@adventure-bot/game/store/selectors'

export function announceWinner(client: Client, bearer: Character): void {
  const state = store.getState()
  const lastChannelId = selectLastChannelUsed(state)
  const channel = client.channels.cache.get(lastChannelId)
  if (!channel?.isText()) return
  channel.send({
    content: `All bow to your sovereign ruler ${decoratedName(
      bearer
    )}!\n\nGame over!`,
    embeds: leaderboard(),
  })
}
