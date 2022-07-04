import { MessageEmbed, TextChannel } from 'discord.js'

import { decoratedName } from '@adventure-bot/game/character'
import { leaderboardEmbeds } from '@adventure-bot/game/leaderboard'
import store from '@adventure-bot/game/store'
import { winnerDeclared } from '@adventure-bot/game/store/actions'
import { startAppListening } from '@adventure-bot/game/store/listenerMiddleware'
import { selectBearer } from '@adventure-bot/game/store/selectors'
import { timeTillSovereign } from '@adventure-bot/game/store/slices/crown'
import { asset } from '@adventure-bot/game/utils'

export function announceWinners(channel: TextChannel): void {
  setInterval(() => {
    const state = store.getState()
    if (state.crown.announced) {
      return
    }
    const bearer = selectBearer(state)
    if (bearer && Date.now() - state.crown.claimedAt > timeTillSovereign) {
      store.dispatch(
        winnerDeclared({
          winner: bearer,
        })
      )
    }
  }, 60 * 1000)

  startAppListening({
    actionCreator: winnerDeclared,
    effect: ({ payload: { winner, interaction } }) => {
      const embeds = [
        new MessageEmbed({
          title: `${decoratedName(winner)} won the crown!`,
          description: 'Game over!',
          color: 'YELLOW',
        }).setImage(asset('fantasy', 'magic', 'glitter dust').s3Url),
        ...leaderboardEmbeds(),
      ]
      if (interaction) {
        interaction.editReply({ embeds })
        return
      }
      channel.send({
        embeds,
      })
    },
  })
}
