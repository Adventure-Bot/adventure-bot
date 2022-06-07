import { createAction, createSlice, isAnyOf } from '@reduxjs/toolkit'
import { prop } from 'remeda'

import { heavyCrownId } from '@adventure-bot/game/equipment'
import store from '@adventure-bot/game/store'
import {
  backdateCrown,
  itemReceived,
  newgame,
  winnerDeclared,
} from '@adventure-bot/game/store/actions'
import { startAppListening } from '@adventure-bot/game/store/listenerMiddleware'
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

export const crownReceived =
  createAction<{ characterId: string }>('crown/received')

startAppListening({
  actionCreator: looted,
  effect: ({ payload: { itemsTaken, looterId } }) => {
    if (itemsTaken.map(prop('id')).includes(heavyCrownId))
      store.dispatch(crownReceived({ characterId: looterId }))
  },
})

startAppListening({
  actionCreator: itemReceived,
  effect: ({ payload: { characterId, item } }) => {
    item.id === heavyCrownId && store.dispatch(crownReceived({ characterId }))
  },
})

const crownSlice = createSlice({
  name: 'crown',
  initialState: crownDefaultState(),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(crownReceived, (state, action) => {
        state.bearerId = action.payload.characterId
        state.claimedAt = Date.now()
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
