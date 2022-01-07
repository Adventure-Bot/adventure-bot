import { getRandomArrayElement } from "../utils/getRandomArrayElement";
import { getRoamingMonsters } from "./getRoamingMonsters";
import { isMonster, Monster } from "./Monster";
import { createRandomMonster } from "./createRandomMonster";

export const getRandomMonster = (): Monster => {
  const roamingMonsters = getRoamingMonsters();
  if (roamingMonsters.length && Math.random() <= roamingMonsters.length / 10) {
    console.log("returning existing monster");
    const monster = getRandomArrayElement(roamingMonsters);
    if (monster && isMonster(monster)) return monster;
  }
  console.log("spawning new monster");
  return createRandomMonster();
};
