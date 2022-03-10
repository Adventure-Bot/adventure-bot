import { Client, MessageEmbed } from 'discord.js'

import { decoratedName } from '@adventure-bot/game/character'
import { leaderboard } from '@adventure-bot/game/commands/leaderboard'
import store from '@adventure-bot/game/store'
import { winnerDeclared } from '@adventure-bot/game/store/actions'
import {
  selectBearer,
  selectLastChannelUsed,
} from '@adventure-bot/game/store/selectors'
import { timeTillSovereign } from '@adventure-bot/game/store/slices/crown'
import { asset } from '@adventure-bot/game/utils'

export const declareWinners: (client: Client) => void = (client) => {
  setInterval(() => {
    const state = store.getState()
    if (state.crown.announced) {
      return
    }
    const bearer = selectBearer(state)
    if (bearer && Date.now() - state.crown.claimedAt > timeTillSovereign) {
      const state = store.getState()
      const lastChannelId = selectLastChannelUsed(state)
      const channel = client.channels.cache.get(lastChannelId)
      if (!channel?.isText()) return
      channel.send({
        embeds: [
          new MessageEmbed({
            title: `${decoratedName(bearer)} won the crown!`,
            description: 'Game over!',
            color: 'YELLOW',
          }).setImage(asset('fantasy', 'magic', 'glitter dust').s3Url),
          ...leaderboard(),
        ],
      })

      store.dispatch(
        winnerDeclared({
          winner: bearer,
        })
      )
    }
  }, 100)
}
