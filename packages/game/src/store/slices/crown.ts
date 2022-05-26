import { createSlice } from '@reduxjs/toolkit'

import { heavyCrownId } from '@adventure-bot/game/equipment'
import {
  backdateCrown,
  itemReceived,
  newgame,
  winnerDeclared,
} from '@adventure-bot/game/store/actions'
import { looted } from '@adventure-bot/game/store/slices/characters'

export function crownDefaultState(): {
  bearerId: string
  claimedAt: number
  gameStartedAt: number
  announced: boolean
} {
  return {
    bearerId: '',
    claimedAt: 0,
    gameStartedAt: Date.now(),
    announced: false,
  }
}
export const timeTillSovereign = 1000 * 60 * 60 * 24

const crownSlice = createSlice({
  name: 'crown',
  initialState: crownDefaultState(),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(itemReceived, (state, action) => {
        if (action.payload.item.id == heavyCrownId) {
          state.bearerId = action.payload.characterId
          state.claimedAt = Date.now()
        }
      })
      .addCase(looted, (state, action) => {
        if (action.payload.itemsTaken.some((item) => item.id == heavyCrownId)) {
          state.bearerId = action.payload.looterId
          state.claimedAt = Date.now()
        }
      })
      .addCase(backdateCrown, (state) => {
        state.claimedAt -= timeTillSovereign
      })
      .addCase(winnerDeclared, (state) => {
        state.announced = true
      })
      .addCase(newgame, (state) => {
        Object.assign(state, crownDefaultState())
      })
  },
})

export default crownSlice.reducer
