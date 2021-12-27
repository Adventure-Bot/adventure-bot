import { Character } from "../character/Character";

import store from "../store";
import { updateCharacter as doUpdateCharacter } from "../store/slices/characters";

/**
 * @deprecated call updateCharacter directly
 * @param character
 * @returns
 */
export const updateCharacter = <T extends Character>(character: T): T => {
  store.dispatch(doUpdateCharacter(character));
  return character;
};
