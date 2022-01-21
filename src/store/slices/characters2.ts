import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import { created } from '@adventure-bot/store/slices/characters'

const characterAdapater = createEntityAdapter<{
  id: string
  name: string
  profile: string
}>({
  selectId: (character) => character.id,
})

const characters2Slice = createSlice({
  name: 'characters2',
  initialState: characterAdapater.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(created, (state, action) => {
      characterAdapater.addOne(state, {
        id: action.payload.id,
        name: action.payload.name,
        profile: action.payload.profile,
      })
    })
  },
})

export default characters2Slice.reducer
