import { createMonster } from "./createMonster";
import { getRandomArrayElement } from "../utils/getRandomArrayElement";
import { getRandomMonsterName } from "./names/getRandomMonsterName";
import { getRoamingMonsters } from "./getRoamingMonsters";
import { getAsset } from "../utils/getAsset";
import { isMonster, Monster } from "./Monster";

export const getRandomMonster = async (): Promise<Monster> => {
  const roamingMonsters = getRoamingMonsters();
  if (roamingMonsters.length && Math.random() <= roamingMonsters.length / 10) {
    console.log("returning existing monster");
    const monster = getRandomArrayElement(roamingMonsters);
    if (monster && isMonster(monster)) return monster;
  }
  const rand = Math.random();
  console.log("spawning new monster");
  switch (true) {
    case rand > 0.9:
      return createMonster({
        kind: "Slime",
        name: getRandomMonsterName("Slime"),
        hp: 24,
        maxHP: 24,
        ac: 7,
        attackBonus: 0,
        damageBonus: 2,
        damageMax: 4,
        gold: Math.floor(Math.random() * 8) + 6,
        asset: getAsset("fantasy", "monsters", "green slime").values(),
        xpValue: 4,
      });
    case rand > 0.6:
      return createMonster({
        kind: "Zombie",
        name: getRandomMonsterName("Zombie"),
        asset: getAsset("fantasy", "monsters", "zombie").values(),
        gold: Math.floor(Math.random() * 6) + 2,
        xpValue: 2,
      });
    case rand > 0.3:
      return createMonster({
        kind: "Demon",
        name: getRandomMonsterName("Demon"),
        hp: 12,
        maxHP: 12,
        ac: 10,
        attackBonus: 2,
        equipment: {
          weapon: {
            name: "Demon Claws",
            accuracyDescriptors: {
              wideMiss: [
                "<@attacker>'s claws slash in the approximate direction of <@defender>",
              ],
              nearMiss: ["<@attacker>'d claws nearly slash <@defender>"],
              onTheNose: ["<@attacker>'s claws rake <@defender>"],
              veryAccurate: ["<@attacker>'s claws rake <@defender> true"],
            },
            damageMax: 6,
            description: "the claws of a demon",
            equippable: true,
            goldValue: 0,
            id: "claws",
            type: "weapon",
            lootable: false,
            sellable: false,
          },
        },
        asset: getAsset("fantasy", "monsters", "demon").values(),
        profile: "https://i.imgur.com/MV96z4T.png",
        xpValue: 10,
        gold: Math.floor(Math.random() * 10) + 6,
      });
    default:
      return createMonster({
        kind: "Goblin",
        name: getRandomMonsterName("Goblin"),
        hp: 5,
        maxHP: 5,
        asset: getAsset("fantasy", "monsters", "goblin").values(),
        xpValue: 1,
        gold: Math.floor(Math.random() * 3) + 1,
      });
  }
};
