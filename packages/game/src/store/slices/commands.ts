import { createSlice } from '@reduxjs/toolkit'

import { commandUsed } from '@adventure-bot/game/store/actions'

const commandsUsed: { [key: string]: number } = {}

export const defaultCommandsState = {
  lastChannelId: '',
  commandsUsed,
}

const commandsSlice = createSlice({
  name: 'commands',
  initialState: {
    ...defaultCommandsState,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(commandUsed, (state, action) => {
      const { commandName } = action.payload
      state.commandsUsed[commandName] =
        (state.commandsUsed[commandName] ?? 0) + 1
      state.lastChannelId = action.payload.channelId
    })
  },
})

export default commandsSlice.reducer
