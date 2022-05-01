import { createSlice } from '@reduxjs/toolkit'

import { Character } from '@adventure-bot/game/character'
import {
  commandUsed,
  winnerDeclared,
  winnerRevoked,
} from '@adventure-bot/game/store/actions'

type Score = { name: string; gold: number; wins: number; profile: string }
type Victory = {
  winner: Character
  date: number
}

export const defaultLeaderboardState: {
  winners: Character[]
  victoriesByCharacter: { [characterId: string]: Victory[] }
  scoresByCharacter: { [id: string]: Score }
  leaderboard: Score[]
  channelId: string
} = {
  winners: [],
  victoriesByCharacter: {},
  channelId: '',
  leaderboard: [],
  scoresByCharacter: {},
}

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState: {
    ...defaultLeaderboardState,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(commandUsed, (state, action) => {
        state.channelId = action.payload.channelId
      })
      .addCase(winnerDeclared, (state, action) => {
        const winner = action.payload.winner
        const date = Date.now()
        const victory: Victory = {
          winner,
          date,
        }
        if (!state.victoriesByCharacter[winner.id]) {
          state.victoriesByCharacter[winner.id] = []
        }
        state.victoriesByCharacter[winner.id].push(victory)
        state.winners.push(winner)
        const currentScore = state.scoresByCharacter[winner.id] ?? {
          name: winner.name,
          gold: 0,
          wins: 0,
          profile: winner.profile,
        }
        currentScore.wins++
        currentScore.gold += winner.gold
        state.scoresByCharacter[winner.id] = currentScore
        state.leaderboard = Object.values(state.scoresByCharacter).sort(
          (a, b) => (b.wins == a.wins ? b.gold - a.gold : b.wins - a.wins)
        )
      })
      .addCase(winnerRevoked, (state) => {
        const winner = state.winners.pop()
        if (!winner) return
        const currentScore = state.scoresByCharacter[winner.id]
        currentScore.wins--
        currentScore.gold -= winner.gold
        state.leaderboard = Object.values(state.scoresByCharacter).sort(
          (a, b) => (b.wins == a.wins ? b.gold - a.gold : b.wins - a.wins)
        )
      })
  },
})

export default leaderboardSlice.reducer
