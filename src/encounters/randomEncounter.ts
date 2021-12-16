import {
  angels,
  fairyWell,
  shop,
  trap,
  travel,
  chest,
  divineBlessing,
  monster,
  tavern,
} from ".";
import { CommandHandler, weightedTable } from "../utils";
import { randomShrine } from "./shrine/randomShrine";

export const randomEncounter = (): CommandHandler => {
  return weightedTable([
    [0.2, () => divineBlessing],
    [0.5, () => angels],
    [1, () => fairyWell],
    [1, () => shop],
    [1, () => tavern],
    [1, () => trap],
    [1, () => travel],
    [2, () => monster],
    [2, () => chest],
    [2, randomShrine],
  ])();
};
