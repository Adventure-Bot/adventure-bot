import { createMonster } from "./createMonster";
import { getRandomItem } from "./getRandomItem";
import { getRandomMonsterName } from "./names/getRandomMonsterName";
import { getRoamingMonsters } from "./getRoamingMonsters";
import { Monster } from "./Monster";
import { getAsset } from "../utils/getAsset";

export const getRandomMonster = async (): Promise<Monster> => {
  const roamingMonsters = getRoamingMonsters();
  // if (roamingMonsters.length && Math.random() <= roamingMonsters.length / 10) {
  //   console.log("returning existing monster");
  //   const monster = getRandomItem(roamingMonsters);
  //   if (monster) return monster;
  // }
  const rand = Math.random();
  console.log("spawning new monster");
  switch (true) {
    case rand > 0.9:
      return createMonster({
        name: "Green Slime",
        hp: 24,
        maxHP: 24,
        ac: 7,
        attackBonus: 0,
        damageBonus: 2,
        damageMax: 4,
        gold: Math.floor(Math.random() * 8) + 3,
        profile:
          getAsset('fantasy', 'monsters', 'green slime').s3Url(),
      });
    case rand > 0.6:
      return createMonster({
        name: getRandomMonsterName("Zombie"),
        profile: getAsset('fantasy', 'monsters', 'zombie').s3Url(),
        gold: Math.floor(Math.random() * 6) + 2,
        isMonster: true,
      });
    case rand > 0.3:
      return createMonster({
        hp: 8,
        maxHP: 8,
        name: getRandomMonsterName("Demon"),
        profile: getAsset('fantasy', 'monsters', 'demon').s3Url(),
        xpValue: 4,
        gold: Math.floor(Math.random() * 5) + 1,
        isMonster: true,
      });
    default:
      return createMonster({
        hp: 5,
        maxHP: 5,
        name: getRandomMonsterName("Goblin"),
        profile: getAsset('fantasy', 'monsters', 'goblin').s3Url(),
        xpValue: 3,
        gold: Math.floor(Math.random() * 3) + 1,
        isMonster: true,
      });
  }
};

// (async function () {
//   for (let index = 0; index < 5; index++) {
//     const monster = await getRandomMonster();
//     console.log("Monster name: ", monster.name);
//   }
// })();
