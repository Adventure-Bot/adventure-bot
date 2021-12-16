import { purgeExpiredStatuses } from "../statusEffects/purgeExpiredStatuses";
import { Character } from "../character/Character";
import store from "../store";
import { selectCharacterById, selectMonsterById } from "../store/selectors";

export const getCharacter = (characterId: string): Character | void => {
  purgeExpiredStatuses(characterId);
  const state = store.getState();
  const character = selectCharacterById(state, characterId);
  return character ?? selectMonsterById(state, characterId);
};
