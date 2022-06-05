import { createSlice } from '@reduxjs/toolkit'

import {
  characterMessageCreated,
  newgame,
} from '@adventure-bot/game/store/actions'

const initialState: Record<string, Record<string, string>> = {}

const characterMessagesSlice = createSlice({
  name: 'characterMessages',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(newgame, () => ({}))
      .addCase(characterMessageCreated, (state, action) => {
        const { character, message, guild } = action.payload
        state[guild.id] = {
          ...state[guild.id],
          [character.id]: message.id,
        }
      })
  },
})

export default characterMessagesSlice.reducer
