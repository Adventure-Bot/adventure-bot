import { randomUUID } from "crypto";
import { CommandInteraction } from "discord.js";
import { Shrine } from "../../shrines/Shrine";
import { shrineEmbeds } from "./shrineEmbeds";
import { applyShrine } from "./applyShrine";
import { getAsset } from "../../utils/getAsset";
import { createEffect } from "../../statusEffects";

export const vigorShrine = async (
  interaction: CommandInteraction
): Promise<void> => {
  const shrine: Shrine = {
    id: randomUUID(),
    name: "Vigor Shrine",
    description: `The shrine fills you with renewed vigor.`,
    image: getAsset(
      "fantasy",
      "places",
      "a beautiful glowing statue in a serene forest"
    ).s3Url,
    color: "WHITE",
    effect: createEffect("invigorated"),
  };

  applyShrine({ shrine, interaction });

  interaction.editReply({
    embeds: shrineEmbeds({ shrine, interaction }),
  });
};
