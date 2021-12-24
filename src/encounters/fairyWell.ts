import { CommandInteraction, MessageEmbed } from "discord.js";
import { adjustHP } from "../character/adjustHP";
import { awardXP } from "../character/awardXP";
import { getUserCharacter } from "../character/getUserCharacter";
import { hpBarField } from "../character/hpBar/hpBarField";
import { xpGainField } from "../character/xpGainField";
import quests from "../commands/quests";
import { Emoji } from "../Emoji";
import { isUserQuestComplete } from "../quest/isQuestComplete";
import { questProgressField } from "../quest/questProgressField";
import { updateUserQuestProgess } from "../quest/updateQuestProgess";
import { getAsset } from "../utils/getAsset";

export const fairyWell = async (
  interaction: CommandInteraction
): Promise<void> => {
  const healAmount = Math.ceil(Math.random() * 6);
  adjustHP(interaction.user.id, healAmount);
  awardXP(interaction.user.id, 1);
  updateUserQuestProgess(interaction.user, "healer", healAmount);

  const character = getUserCharacter(interaction.user);
  await interaction.editReply({
    embeds: [
      new MessageEmbed({
        title: `${
          interaction.user.username
        } drinks from a fairy's well and gains ${Emoji(
          interaction,
          "heal"
        )} +${healAmount}!`,
        color: "DARK_VIVID_PINK",
        description: `You drink from a fairy's well, it heals you for ${healAmount}!`,
        fields: [
          xpGainField(interaction, 1),
          hpBarField({ character, adjustment: healAmount }),
        ].concat(
          character.quests.healer
            ? questProgressField(character.quests.healer)
            : []
        ),
      }).setImage(getAsset("fantasy", "places", "a fairy's well").s3Url()),
    ],
  });
  if (isUserQuestComplete(interaction.user, "healer"))
    await quests.execute(interaction);
};
