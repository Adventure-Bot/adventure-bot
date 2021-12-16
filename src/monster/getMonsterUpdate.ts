import { purgeExpiredStatuses } from "../statusEffects/purgeExpiredStatuses";
import { Monster } from "./Monster";
import { selectMonsterById } from "../store/selectors";
import store from "../store";

export const getMonsterUpdate = (monster: Monster): Monster => {
  purgeExpiredStatuses(monster.id);
  return selectMonsterById(store.getState(), monster.id) ?? monster;
};
