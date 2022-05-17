import { combineReducers } from '@reduxjs/toolkit'

import schedule from '@adventure-bot/game/store/schedule/schedule'
import characterList from '@adventure-bot/game/store/slices/characterList'
import characters from '@adventure-bot/game/store/slices/characters'
import commands from '@adventure-bot/game/store/slices/commands'
import crown from '@adventure-bot/game/store/slices/crown'
import encounters from '@adventure-bot/game/store/slices/encounters'
import leaderboard from '@adventure-bot/game/store/slices/leaderboard'
import loots from '@adventure-bot/game/store/slices/loots'
import shop from '@adventure-bot/game/store/slices/shop'

const rootReducer = combineReducers({
  characters,
  characterList,
  commands,
  crown,
  encounters,
  leaderboard,
  loots,
  schedule,
  shop,
})

export default rootReducer
