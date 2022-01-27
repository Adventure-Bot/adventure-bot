import { createSlice } from '@reduxjs/toolkit'

import { defaultCooldowns } from '@adventure-bot/character'

const cooldownsSlice = createSlice({
  name: 'cooldowns',
  initialState: {
    ...defaultCooldowns,
  },
  reducers: {},
})

export default cooldownsSlice.reducer
