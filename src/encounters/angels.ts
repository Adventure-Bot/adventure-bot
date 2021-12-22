import { CommandInteraction, MessageEmbed } from "discord.js";
import { getUserCharacter } from "../character/getUserCharacter";
import { questEmbed } from "../quest/questEmbed";
import { getAsset } from "../utils/getAsset";
import store from "../store";
import { grantQuest } from "../store/slices/characters";

export const angels = async (
  interaction: CommandInteraction
): Promise<void> => {
  store.dispatch(
    grantQuest({
      characterId: interaction.user.id,
      questId: "healer",
    })
  );
  const character = getUserCharacter(interaction.user);
  interaction.followUp({
    embeds: [
      new MessageEmbed({
        title: "Angels",
        color: "WHITE",
        description:
          "An angel implores you to mend what is broken.\nA taste of their power in return is thier token.",
      }).setImage(getAsset("fantasy", "characters", "angel").s3Url()),
    ].concat(questEmbed(character) ?? []),
  });
};
