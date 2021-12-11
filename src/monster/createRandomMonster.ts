import { Monster } from "./Monster";
import { weightedTable } from "../utils";
import {
  createDemon,
  createGoblin,
  createSlime,
  createZombie,
} from "./monsters";

export function createRandomMonster(): Monster {
  return weightedTable([
    [1, createDemon],
    [1, createGoblin],
    [1, createSlime],
    [1, createZombie],
  ])();
}
