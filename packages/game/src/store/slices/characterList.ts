import { createSlice } from '@reduxjs/toolkit'

import { characterListCreated } from '@adventure-bot/game/character/list/characterListCreated'
import { characterMessageCreated } from '@adventure-bot/game/store/actions'

const messageIdsByCharacterId: Record<string, string> = {}

const characterListSlice = createSlice({
  name: 'characterList',
  initialState: {
    messageIdsByCharacterId,
    channelId: '',
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
      .addCase(characterListCreated, (state, action) => {
        state.channelId = action.payload.id
        state.messageIdsByCharacterId = {}
      })
  },
})

export default characterListSlice.reducer
