import { createSlice } from '@reduxjs/toolkit'
import { commandUsed } from '../actions'

export const defaultCommands = {
  lastChannelId: '',
}

const commandsSlice = createSlice({
  name: 'commands',
  initialState: {
    ...defaultCommands,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(commandUsed, (state, action) => {
      state.lastChannelId = action.payload.channelId
    })
  },
})

export default commandsSlice.reducer
