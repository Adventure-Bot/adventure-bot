import { CommandInteraction } from "discord.js";
import { getUserCharacter } from "../../character/getUserCharacter";
import { buffQuestReward } from "./buffQuestReward";
import { healerStatus } from "./healerStatus";

export const healerQuestReward = async (
  interaction: CommandInteraction
): Promise<void> => {
  const quest = getUserCharacter(interaction.user).quests.healer;
  if (!quest) return;
  buffQuestReward(interaction, healerStatus, quest);
};
