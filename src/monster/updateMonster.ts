import { Monster } from "./Monster";
import store from "../store";
import { selectMonsterById } from "../store/selectors";
import { updateCharacter } from "../character/updateCharacter";

export const updateMonster = (monster: Monster): Monster => {
  updateCharacter(monster);
  return selectMonsterById(store.getState(), monster.id) ?? monster;
};
