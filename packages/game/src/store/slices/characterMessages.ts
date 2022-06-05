import { createSlice } from '@reduxjs/toolkit'

import {
  characterMessageCreated,
  characterMessageDeleted,
  newgame,
} from '@adventure-bot/game/store/actions'

const initialState: Record<string, Record<string, string>> = {}

const characterMessagesSlice = createSlice({
  name: 'characterMessages',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(newgame, () => {
        return {}
      })
      .addCase(characterMessageCreated, (state, action) => {
        const { character, message, guild } = action.payload
        state[guild.id] = {
          ...state[guild.id],
          [character.id]: message.id,
        }
      })
      .addCase(characterMessageDeleted, (state, action) => {
        const { guildId, characterId } = action.payload
        delete state[guildId][characterId]
      })
  },
})

export default characterMessagesSlice.reducer
