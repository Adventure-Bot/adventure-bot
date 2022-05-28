import { createSlice } from '@reduxjs/toolkit'
import { mapValues } from 'remeda'

import {
  characterMessageCreated,
  characterMessageDeleted,
} from '@adventure-bot/game/store/actions'

const initialState: Record<string, Record<string, string>> = {}

const characterMessagesSlice = createSlice({
  name: 'characterMessages',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(characterMessageCreated, (state, action) => {
        const { character, message, guild } = action.payload
        state[guild.id] = {
          ...state[guild.id],
          [character.id]: message.id,
        }
      })
      .addCase(characterMessageDeleted, (state, action) => {
        const { messageId, guildId } = action.payload
        mapValues(state[guildId], (characterId, savedMessageId) => {
          if (savedMessageId === messageId) {
            delete state[guildId][characterId]
          }
        })
      })
  },
})

export default characterMessagesSlice.reducer
