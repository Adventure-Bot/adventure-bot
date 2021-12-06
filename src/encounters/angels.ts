import { CommandInteraction, MessageEmbed } from "discord.js";
import { getUserCharacter } from "../character/getUserCharacter";
import { updateCharacter } from "../character/updateCharacter";
import { questEmbed } from "../commands/questEmbed";
import { grantQuest } from "../quest/grantQuest";
import { getAsset } from "../utils/getAsset";

export const angels = async (
  interaction: CommandInteraction
): Promise<void> => {
  const character = updateCharacter(
    grantQuest(getUserCharacter(interaction.user), "healer")
  );
  if (!character) return;

  interaction.followUp({
    embeds: [
      new MessageEmbed({
        title: "Angels",
        color: "WHITE",
        description:
          "An angel implores you to mend what is broken.\nA taste of their power in return is thier token.",
      })
      .setImage(getAsset('fantasy', 'characters', 'angel').s3Url()),
    ].concat(questEmbed(character) ?? []),
  });
};
