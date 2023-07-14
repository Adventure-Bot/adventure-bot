import { createAction, createSlice } from '@reduxjs/toolkit'
import { CommandInteraction } from 'discord.js'

import { StatusEffect } from '@adventure-bot/game/statusEffects'
import { newgame } from '@adventure-bot/game/store/actions'
import { CharacterWithStats } from '@adventure-bot/game/store/selectors'

const initialState = {
  effectsById: {} as Record<string, StatusEffect>,
  effectsByCharacterId: {} as Record<string, Record<string, boolean>>,
}

export const effectAdded = createAction<{
  interaction: CommandInteraction
  character: CharacterWithStats
  effect: StatusEffect
  image?: string
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
          const effect = state.effectsById[effectId]
          if (debuffOnly && !effect.debuff) continue
          delete state.effectsById[effectId]
          delete state.effectsByCharacterId[characterId][effectId]
        }
      })
      .addCase(effectAdded, (state, action) => {
        const { effect, character } = action.payload
        state.effectsById[effect.id] = effect
        // remove prior effects with the same name
        for (const effectId in state.effectsByCharacterId[character.id]) {
          const oldEffect = state.effectsById[effectId]
          if (effect.name === oldEffect.name) {
            delete state.effectsById[oldEffect.id]
            delete state.effectsByCharacterId[character.id][oldEffect.id]
          }
        }
        state.effectsByCharacterId[character.id] = {
          ...state.effectsByCharacterId[character.id],
          [effect.id]: true,
        }
      })
  },
}).reducer
