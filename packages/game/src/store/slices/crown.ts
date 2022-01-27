import { createSlice } from '@reduxjs/toolkit'

import { heavyCrownId } from '@adventure-bot/game/equipment'
import {
  backdateCrown,
  itemReceived,
  newGame,
  tick,
  winnerDeclared,
} from '@adventure-bot/game/store/actions'

export const crownDefaultState = {
  bearerId: '',
  claimedAt: 0,
  timeRemaining: 0,
  sovereign: false,
  announced: false,
}
const twentyFourHours = 1000 * 60 * 60 * 24

const crownSlice = createSlice({
  name: 'crown',
  initialState: crownDefaultState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(itemReceived, (state, action) => {
        if (action.payload.item.id == heavyCrownId) {
          state.bearerId = action.payload.characterId
          state.claimedAt = Date.now()
        }
      })
      .addCase(backdateCrown, (state) => {
        state.claimedAt -= twentyFourHours // for testing
      })
      .addCase(winnerDeclared, (state) => {
        state.announced = true
      })
      .addCase(tick, (state) => {
        state.timeRemaining = state.claimedAt
          ? state.claimedAt + twentyFourHours - Date.now()
          : 0
        if (state.claimedAt && state.timeRemaining <= 0) {
          state.sovereign = true
        }
      })
      .addCase(newGame, (state) => {
        Object.assign(state, crownDefaultState)
      })
  },
})

export default crownSlice.reducer
