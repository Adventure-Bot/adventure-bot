import { createSlice } from '@reduxjs/toolkit'

import { characterMessageCreated } from '@adventure-bot/game/store/actions'

type CharacterMessages = Record<string, Record<string, string>>

const initialState: CharacterMessages = {}

const characterMessagesSlice = createSlice({
  name: 'characterMessages',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(characterMessageCreated, (state, action) => {
      const { character, message, guild } = action.payload
      state[guild.id] = {
        ...state[guild.id],
        [character.id]: message.id,
      }
    })
  },
})

export default characterMessagesSlice.reducer
