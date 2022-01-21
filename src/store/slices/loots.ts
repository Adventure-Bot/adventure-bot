import { LootResult } from '@adventure-bot/character/loot/loot'
import { createAction, createSlice } from '@reduxjs/toolkit'
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
