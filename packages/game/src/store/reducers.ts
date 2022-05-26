import { combineReducers } from '@reduxjs/toolkit'

import leaderboard from '@adventure-bot/game/leaderboard/leaderboardSlice'
import schedule from '@adventure-bot/game/store/schedule/schedule'
import characterMessages from '@adventure-bot/game/store/slices/characterMessages'
import characters from '@adventure-bot/game/store/slices/characters'
import commands from '@adventure-bot/game/store/slices/commands'
import crown from '@adventure-bot/game/store/slices/crown'
import encounters from '@adventure-bot/game/store/slices/encounters'
import shop from '@adventure-bot/game/store/slices/shop'

const rootReducer = combineReducers({
  characters,
  characterMessages,
  commands,
  crown,
  encounters,
  leaderboard,
  schedule,
  shop,
})

export default rootReducer
