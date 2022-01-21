import { defaultCooldowns } from '@adventure-bot/character/defaultCooldowns'
import { createSlice } from '@reduxjs/toolkit'

const cooldownsSlice = createSlice({
  name: 'cooldowns',
  initialState: {
    ...defaultCooldowns,
  },
  reducers: {},
})

export default cooldownsSlice.reducer
