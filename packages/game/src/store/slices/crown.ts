import { createSlice } from '@reduxjs/toolkit'

import { heavyCrownId } from '@adventure-bot/game/equipment'
import {
  backdateCrown,
  itemReceived,
  newGame,
  winnerDeclared,
} from '@adventure-bot/game/store/actions'
import { characterLooted } from '@adventure-bot/game/store/slices/loots'

export const crownDefaultState = {
  bearerId: '',
  claimedAt: 0,
  announced: false,
}
export const timeTillSovereign = 1000 * 60 * 60 * 24

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
      .addCase(characterLooted, (state, action) => {
        if (action.payload.itemsTaken.some((item) => item.id == heavyCrownId)) {
          state.bearerId = action.payload.looterId
          state.claimedAt = Date.now()
        }
      })
      .addCase(backdateCrown, (state) => {
        state.claimedAt -= timeTillSovereign
      })
      .addCase(winnerDeclared, (state) => {
        state.announced = true
      })
      .addCase(newGame, (state) => {
        Object.assign(state, crownDefaultState)
      })
  },
})

export default crownSlice.reducer
