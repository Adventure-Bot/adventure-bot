import { Character } from "../character/Character";
import store from "../store";
import { selectCharacterById, selectMonsterById } from "../store/selectors";

export const getCharacter = (characterId: string): Character | void => {
  const state = store.getState();
  const character = selectCharacterById(state, characterId);
  return character ?? selectMonsterById(state, characterId);
};
