import { createAction, createSlice } from '@reduxjs/toolkit'

import { StatusEffect } from '@adventure-bot/game/statusEffects'
import { newgame } from '@adventure-bot/game/store/actions'
import { CharacterWithStats } from '@adventure-bot/game/store/selectors'

const initialState = {
  effectsById: {} as Record<string, StatusEffect>,
  effectsByCharacterId: {} as Record<string, Record<string, boolean>>,
}

export const effectAdded = createAction<{
  character: CharacterWithStats
  effect: StatusEffect
  image?: string
  messageId?: string
}>('effect/added')

export const characterCleansed = createAction<{
  characterId: string
  debuffOnly?: boolean
}>('character/cleansed')

export const statusEffects = createSlice({
  name: 'statusEffects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(newgame, () => initialState)
      .addCase(characterCleansed, (state, action) => {
        const { characterId, debuffOnly } = action.payload
        for (const effectId in state.effectsByCharacterId[characterId]) {
          const isDebuff = state.effectsById[effectId].debuff
          if (debuffOnly && !isDebuff) continue
          delete state.effectsById[effectId]
        }
        state.effectsByCharacterId[characterId] = {}
      })
      .addCase(effectAdded, (state, action) => {
        const { effect, character } = action.payload
        state.effectsById[effect.id] = effect
        state.effectsByCharacterId[character.id] = {
          ...state.effectsByCharacterId[character.id],
          [effect.id]: true,
        }
      })
  },
}).reducer
