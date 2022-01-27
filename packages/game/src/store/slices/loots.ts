import { createAction, createSlice } from '@reduxjs/toolkit'

import { LootResult } from '@adventure-bot/game/character'
import { newGame } from '@adventure-bot/game/store/actions'

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
