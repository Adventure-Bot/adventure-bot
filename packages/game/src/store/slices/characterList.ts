import { createSlice } from '@reduxjs/toolkit'

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
    builder.addCase(characterMessageCreated, (state, action) => {
      if (!state.messageIdsByCharacterId) {
        state.messageIdsByCharacterId = {}
      }
      state.messageIdsByCharacterId[action.payload.character.id] =
        action.payload.message.id
    })
  },
})

export default characterListSlice.reducer
