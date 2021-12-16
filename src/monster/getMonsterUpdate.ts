import { Monster } from "./Monster";
import { selectMonsterById } from "../store/selectors";
import store from "../store";

export const getMonsterUpdate = (monster: Monster): Monster => {
  return selectMonsterById(store.getState(), monster.id) ?? monster;
};
