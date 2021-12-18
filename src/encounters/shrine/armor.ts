import { randomUUID } from "crypto";
import { CommandInteraction } from "discord.js";
import { Shrine } from "../../shrines/Shrine";
import { shrineEmbeds } from "./shrineEmbeds";
import { applyShrine } from "./applyShrine";
import { getAsset } from "../../utils/getAsset";

export const armorShrine = async (
  interaction: CommandInteraction
): Promise<void> => {
  const shrine: Shrine = {
    id: randomUUID(),
    color: "YELLOW",
    description: `This shrine will protect you during your journeys.`,
    image: getAsset(
      "fantasy",
      "items",
      "a shield chiseled out of a stone"
    ).s3Url(),
    effect: {
      name: "Shrine of Protection",
      modifiers: {
        ac: 2,
      },
      duration: 30 * 60000,
      buff: true,
      debuff: false,
      started: new Date().toString(),
    },
    name: "Shrine of Protection",
  };
  applyShrine({ shrine, interaction });

  interaction.editReply({
    embeds: shrineEmbeds({ shrine, interaction }),
  });
};
