import { combineReducers } from "@reduxjs/toolkit";

import characters from "./slices/characters";
import loots from "./slices/loots";
import encounters from "./slices/encounters";
import cooldowns from "./slices/cooldowns";
import items from "./slices/items";

const rootReducer = combineReducers({
  characters,
  loots,
  encounters,
  cooldowns,
  items,
});

export default rootReducer;
