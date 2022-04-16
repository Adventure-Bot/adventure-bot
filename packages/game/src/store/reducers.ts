import { combineReducers } from '@reduxjs/toolkit'

import characterList from '@adventure-bot/game/store/slices/characterList'
import characters from '@adventure-bot/game/store/slices/characters'
import characters2 from '@adventure-bot/game/store/slices/characters2'
import commands from '@adventure-bot/game/store/slices/commands'
import crown from '@adventure-bot/game/store/slices/crown'
import encounters from '@adventure-bot/game/store/slices/encounters'
import leaderboard from '@adventure-bot/game/store/slices/leaderboard'
import loots from '@adventure-bot/game/store/slices/loots'
import shop from '@adventure-bot/game/store/slices/shop'

const rootReducer = combineReducers({
  characters,
  characterList,
  characters2,
  commands,
  crown,
  encounters,
  leaderboard,
  loots,
  shop,
})

export default rootReducer
