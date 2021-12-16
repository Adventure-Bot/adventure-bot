import { Character } from "./Character";

import store from "../store";
import { selectCharacterById } from "../store/selectors";

export const getCharacterUpdate = (character: Character): Character => {
  return selectCharacterById(store.getState(), character.id) ?? character;
};
