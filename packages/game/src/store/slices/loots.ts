import { createAction, createSlice } from '@reduxjs/toolkit'
import { CommandInteraction } from 'discord.js'

import { LootResult } from '@adventure-bot/game/character'
import { newgame } from '@adventure-bot/game/store/actions'

const lootsById: Record<string, LootResult> = {}

export const characterLooted = createAction<{
  loot: LootResult
  interaction: CommandInteraction
}>('loots/characterLooted')

const lootsSlice = createSlice({
  name: 'loots',
  initialState: {
    lootsById,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(characterLooted, (state, action) => {
        const loot = action.payload.loot
        state.lootsById[loot.id] = loot
      })
      .addCase(newgame, (state) => {
        state.lootsById = {}
      })
  },
})

export default lootsSlice.reducer
