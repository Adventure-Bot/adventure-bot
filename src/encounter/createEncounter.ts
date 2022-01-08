import { Monster } from "../monster/Monster";
import { Encounter } from "./Encounter";
import { Character } from "../character/Character";
import { randomUUID } from "crypto";
import store from "../store";
import { encounterCreated } from "../store/slices/encounters";

export function createEncounter({
  monster,
  player,
}: {
  monster: Monster;
  player: Character;
}): Encounter {
  const encounter: Encounter = {
    characterId: player.id,
    monsterId: monster.id,
    date: new Date().toString(),
    id: randomUUID(),
    playerAttacks: [],
    monsterAttacks: [],
    rounds: 1,
    outcome: "in progress",
  };
  store.dispatch(encounterCreated(encounter));
  return encounter;
}
