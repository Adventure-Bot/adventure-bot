import { createAction, createSlice } from '@reduxjs/toolkit'

import { LootResult } from '@adventure-bot/character'
import { newGame } from '@adventure-bot/store/actions'

const lootsById: Record<string, LootResult> = {}

export const characterLooted = createAction<LootResult>('loots/characterLooted')

const lootsSlice = createSlice({
  name: 'loots',
  initialState: {
    lootsById,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(characterLooted, (state, action) => {
        const loot = action.payload
        state.lootsById[loot.id] = loot
      })
      .addCase(newGame, (state) => {
        state.lootsById = {}
      })
  },
})

export default lootsSlice.reducer
