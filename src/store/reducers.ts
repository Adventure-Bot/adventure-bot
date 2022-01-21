import { combineReducers } from '@reduxjs/toolkit'

import characters from './slices/characters'
import characters2 from './slices/characters2'
import commands from './slices/commands'
import cooldowns from './slices/cooldowns'
import crown from './slices/crown'
import encounters from './slices/encounters'
import leaderboard from './slices/leaderboard'
import loots from './slices/loots'

const rootReducer = combineReducers({
  characters,
  characters2,
  commands,
  cooldowns,
  crown,
  encounters,
  leaderboard,
  loots,
})

export default rootReducer
