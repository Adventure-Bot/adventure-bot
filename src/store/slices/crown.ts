import { createSlice } from '@reduxjs/toolkit'
import { heavyCrownId } from '../../equipment/items/heavyCrown'
import { itemReceived, newGame, tick } from '../actions'

export const crownDefaultState = {
  bearerId: '',
  claimedAt: 0,
  timeRemaining: 0,
  sovereign: false,
}

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
      .addCase(tick, (state) => {
        const twentyFourHours = 1000 * 60 * 60 * 24
        state.timeRemaining = state.claimedAt
          ? state.claimedAt + twentyFourHours - Date.now()
          : 0
        if (state.timeRemaining <= 0) {
          state.sovereign = true
        }
      })
      .addCase(newGame, (state) => {
        Object.assign(state, crownDefaultState)
      })
  },
})

export default crownSlice.reducer
