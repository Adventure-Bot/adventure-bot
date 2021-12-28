import store from "../store";
import { xpAwarded } from "../store/slices/characters";

export const awardXP = (characterId: string, amount: number): void => {
  store.dispatch(xpAwarded({ characterId, amount }));
};
