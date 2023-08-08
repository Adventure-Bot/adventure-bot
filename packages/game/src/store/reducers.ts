import { combineReducers } from '@reduxjs/toolkit'

import { schedule } from '@adventure-bot/game/store/schedule/schedule'
import { characterMessages } from '@adventure-bot/game/store/slices/characterMessages'
import { characters } from '@adventure-bot/game/store/slices/characters'
import { commands } from '@adventure-bot/game/store/slices/commands'
import { crown } from '@adventure-bot/game/store/slices/crown'
import { encounters } from '@adventure-bot/game/store/slices/encounters'
import { shop } from '@adventure-bot/game/store/slices/shop'
import { statusEffects } from '@adventure-bot/game/store/slices/statusEffects'

const rootReducer = combineReducers({
  characters,
  characterMessages,
  commands,
  crown,
  encounters,
  schedule,
  shop,
  statusEffects,
})

export default rootReducer
