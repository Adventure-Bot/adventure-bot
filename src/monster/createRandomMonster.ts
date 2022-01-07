import { Monster } from "./Monster";
import { weightedTable } from "../utils";
import {
  createDemon,
  createGoblin,
  createSlime,
  createZombie,
  createDragon,
} from "./monsters";

export function createRandomMonster(): Monster {
  return weightedTable([
    [10, createDemon],
    [10, createGoblin],
    [10, createSlime],
    [10, createZombie],
    [0.5, createDragon],
  ])();
}
