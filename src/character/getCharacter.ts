import store from "../store";
import { selectCharacterById } from "../store/selectors";

export const getCharacter = (characterId: string) =>
  selectCharacterById(store.getState(), characterId);
