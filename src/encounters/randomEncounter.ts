import { angels, fairyWell, shop, trap, travel, chest } from ".";
import { CommandHandler } from "../utils";
import { weightedTable } from "../utils/weightedTable";
import { divineBlessing } from "./divineBlessing";
import { monster } from "./monster";
import { randomShrine } from "./shrine/randomShrine";
import { tavern } from "./tavern/tavern";

export const randomEncounter = (): CommandHandler =>
  weightedTable([
    [0.1, () => divineBlessing],
    [1, () => angels],
    [1, () => fairyWell],
    [1, () => shop],
    [1, () => tavern],
    [1, () => trap],
    [1, () => travel],
    [2, () => monster],
    [2, () => chest],
    [2, randomShrine],
  ])();
