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
          const effect = state.effectsById[effectId]
          if (debuffOnly && !effect.debuff) continue
          console.log(
            `Removing effect ${effect.name}, debuff: ${effect.debuff} from ${characterId}`
          )
          delete state.effectsById[effectId]
          delete state.effectsByCharacterId[characterId][effectId]
        }
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
