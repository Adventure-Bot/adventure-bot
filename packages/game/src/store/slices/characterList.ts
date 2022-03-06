import { createSlice } from '@reduxjs/toolkit'

import {
  characterListThreadCreated,
  characterMessageCreated,
} from '@adventure-bot/game/store/actions'

const messageIdsByCharacterId: Record<string, string> = {}

const characterListSlice = createSlice({
  name: 'characterList',
  initialState: {
    messageIdsByCharacterId,
    threadId: '',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(characterMessageCreated, (state, action) => {
        if (!state.messageIdsByCharacterId) {
          state.messageIdsByCharacterId = {}
        }
        state.messageIdsByCharacterId[action.payload.character.id] =
          action.payload.message.id
      })
      .addCase(characterListThreadCreated, (state, action) => {
        state.threadId = action.payload.id
        state.messageIdsByCharacterId = {}
      })
  },
})

export default characterListSlice.reducer
