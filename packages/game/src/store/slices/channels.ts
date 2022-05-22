import { createAction, createSlice } from '@reduxjs/toolkit'
import { TextChannel } from 'discord.js'

const channelIdsByName: { [k: string]: string } = {}

export const channelCreated = createAction<TextChannel>('channel/created')

const channelsSlice = createSlice({
  name: 'channels',
  initialState: {
    channelIdsByName,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(channelCreated, (state, action) => {
      state.channelIdsByName[action.payload.name] = action.payload.id
    })
  },
})

export default channelsSlice.reducer
