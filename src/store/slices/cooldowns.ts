import { defaultCooldowns } from '../../character/defaultCooldowns'
import { createSlice } from '@reduxjs/toolkit'

const cooldownsSlice = createSlice({
  name: 'cooldowns',
  initialState: {
    ...defaultCooldowns,
  },
  reducers: {},
})

export default cooldownsSlice.reducer
