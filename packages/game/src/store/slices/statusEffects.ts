import { createAction, createSlice } from '@reduxjs/toolkit'

import { StatusEffect } from '@adventure-bot/game/statusEffects'
import { newgame } from '@adventure-bot/game/store/actions'

const initialState = {
  effectsById: {} as Record<string, StatusEffect>,
  effectsByCharacterId: {} as Record<string, Record<string, boolean>>,
}

export const effectAdded = createAction<{
  characterId: string
  effect: StatusEffect
  image?: string
}>('effect/added')

export const statusEffects = createSlice({
  name: 'statusEffects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(newgame, () => initialState)
      .addCase(effectAdded, (state, action) => {
        const { effect, characterId } = action.payload
        state.effectsById[effect.id] = effect
        state.effectsByCharacterId[characterId] = {
          ...state.effectsByCharacterId[characterId],
          [effect.id]: true,
        }
      })
  },
}).reducer
