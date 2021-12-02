import { Character } from "./Character";
import store from "../store";
import { goldGained } from "../store/slices/characters";

export const adjustGold = (
  characterId: string,
  amount: number
): Character | void => {
  store.dispatch(
    goldGained({
      characterId,
      amount,
    })
  );
};
