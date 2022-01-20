import { createSlice } from '@reduxjs/toolkit'
import { Character } from '../../character/Character'
import { commandInteraction, winnerDeclared } from '../actions'

type Score = { name: string; gold: number; wins: number; profile: string }

export const defaultLeaderboard: {
  winners: Character[]
  scoresByCharacter: { [id: string]: Score }
  leaderboard: Score[]
  channelId: string
} = {
  winners: [],
  channelId: '',
  leaderboard: [],
  scoresByCharacter: {},
}

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState: {
    ...defaultLeaderboard,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(commandInteraction, (state, action) => {
        state.channelId = action.payload.channelId
      })
      .addCase(winnerDeclared, (state, action) => {
        const winner = action.payload.winner
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
  },
})

export default leaderboardSlice.reducer
