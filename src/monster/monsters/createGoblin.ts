import { createMonster } from "../createMonster";
import { getRandomMonsterName } from "../names/getRandomMonsterName";
import { getAsset } from "../../utils/getAsset";
import { Monster } from "../Monster";
import { dagger } from "../../equipment/items";

export function createGoblin(): Monster {
  return createMonster({
    kind: "Goblin",
    name: getRandomMonsterName("Goblin"),
    hp: 5,
    maxHP: 5,
    equipment: {
      weapon: dagger(),
    },
    asset: getAsset("fantasy", "monsters", "goblin").values(),
    xpValue: 2,
    gold: Math.floor(Math.random() * 8) + 6,
  });
}
