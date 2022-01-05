import { CommandInteraction } from "discord.js";
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
import { getUserCharacter } from "../character/getUserCharacter";
import { CommandHandler, weightedTable } from "../utils";
import { randomShrine } from "./shrine/randomShrine";

export const randomEncounter = (
  interaction: CommandInteraction
): CommandHandler => {
  const character = getUserCharacter(interaction.user);
  const angelChance = character.quests.healer ? 0 : 0.5;
  return weightedTable([
    [0.2, () => divineBlessing],
    [angelChance, () => angels],
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
