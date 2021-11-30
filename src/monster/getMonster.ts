import { purgeExpiredStatuses } from "../statusEffects/purgeExpiredStatuses";
import { Monster } from "./Monster";
import store from "../store";
import { getMonsterById } from "../store/selectors";

export const getMonster = (id: string): Monster | void => {
  purgeExpiredStatuses(id);
  const state = store.getState();
  return getMonsterById(state, id);
};
