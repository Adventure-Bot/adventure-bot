import { Character } from "./Character";
import { purgeExpiredStatuses } from "../statusEffects/purgeExpiredStatuses";

import store from "../store";
import { selectCharacterById } from "../store/selectors";

export const getCharacterUpdate = (character: Character): Character => {
  purgeExpiredStatuses(character.id);
  return selectCharacterById(store.getState(), character.id) ?? character;
};
