import { createSlice } from '@reduxjs/toolkit'

import { defaultCooldowns } from '@adventure-bot/character/defaultCooldowns'

const cooldownsSlice = createSlice({
  name: 'cooldowns',
  initialState: {
    ...defaultCooldowns,
  },
  reducers: {},
})

export default cooldownsSlice.reducer
