import { createSlice } from '@reduxjs/toolkit'
import { commandUsed } from '../actions'

export const defaultCommandsState = {
  lastChannelId: '',
}

const commandsSlice = createSlice({
  name: 'commands',
  initialState: {
    ...defaultCommandsState,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(commandUsed, (state, action) => {
      state.lastChannelId = action.payload.channelId
    })
  },
})

export default commandsSlice.reducer
