import { combineReducers } from '@reduxjs/toolkit'

import characters from '@adventure-bot/game/store/slices/characters'
import characters2 from '@adventure-bot/game/store/slices/characters2'
import commands from '@adventure-bot/game/store/slices/commands'
import cooldowns from '@adventure-bot/game/store/slices/cooldowns'
import crown from '@adventure-bot/game/store/slices/crown'
import encounters from '@adventure-bot/game/store/slices/encounters'
import leaderboard from '@adventure-bot/game/store/slices/leaderboard'
import loots from '@adventure-bot/game/store/slices/loots'

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
