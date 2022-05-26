import { createSlice } from '@reduxjs/toolkit'

import { Character } from '@adventure-bot/game/character'
import {
  winnerDeclared,
  winnerRevoked,
} from '@adventure-bot/game/store/actions'

type Score = {
  name: string
  characterId: string
  gold: number
  wins: number
  profile: string
}
type Victory = {
  winner: Character
  date: number
}

export const defaultLeaderboardState: {
  winners: Character[]
  victoriesByCharacter: { [characterId: string]: Victory[] }
  scoresByCharacter: { [id: string]: Score }
  leaderboard: Score[]
} = {
  winners: [],
  victoriesByCharacter: {},
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
      .addCase(winnerDeclared, (state, action) => {
        const winner = action.payload.winner
        const { victoriesByCharacter, winners, scoresByCharacter } = state
        winners.push(winner)
        if (!victoriesByCharacter[winner.id]) {
          victoriesByCharacter[winner.id] = []
        }
        const victories = victoriesByCharacter[winner.id]
        victories.push({
          winner,
          date: Date.now(),
        })

        scoresByCharacter[winner.id] = characterScore(victories)
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

function characterScore(victories: Victory[]): Score {
  const winner = victories[0].winner
  return {
    name: winner.name,
    characterId: winner.id,
    gold: victories
      .map(({ winner: { gold } }) => gold)
      .reduce((a, b) => a + b, 0),
    wins: victories.length,
    profile: winner.profile,
  }
}
