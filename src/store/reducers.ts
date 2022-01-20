import { combineReducers } from '@reduxjs/toolkit'

import characters from "./slices/characters";
import characters2 from "./slices/characters2";
import loots from "./slices/loots";
import encounters from "./slices/encounters";
import cooldowns from "./slices/cooldowns";
import crown from "./slices/crown";

const rootReducer = combineReducers({
  characters,
  characters2,
  loots,
  encounters,
  cooldowns,
  crown,
});

export default rootReducer
