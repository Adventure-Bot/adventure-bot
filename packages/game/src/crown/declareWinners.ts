import { Client } from 'discord.js'

import store from '@adventure-bot/game/store'
import { winnerDeclared } from '@adventure-bot/game/store/actions'
import { selectBearer } from '@adventure-bot/game/store/selectors'
import { timeTillSovereign } from '@adventure-bot/game/store/slices/crown'

import { announceWinner } from './announceWinner'

export const declareWinners: (client: Client) => void = (client) => {
  const intervalId = setInterval(() => {
    const state = store.getState()
    if (state.crown.announced) {
      clearInterval(intervalId)
      return
    }
    const bearer = selectBearer(state)
    if (bearer && Date.now() - state.crown.claimedAt > timeTillSovereign) {
      announceWinner(client, bearer)
      store.dispatch(
        winnerDeclared({
          winner: bearer,
        })
      )
    }
  }, 100)
}
