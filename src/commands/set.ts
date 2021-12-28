import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { URL } from "url";
import store from "../store";
import { profileSet } from "../store/slices/characters";
import { execute as inspect } from "./inspect/inspect";

export const command = new SlashCommandBuilder()
  .setName("set")
  .setDescription("Configure your character")
  .addStringOption((option) =>
    option
      .setName("profile")
      .setDescription(`Set your character's profile picture.`)
      .setRequired(true)
  );

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const profile = interaction.options.data[0].value?.toString();
  if (!profile) return;

  try {
    const url = new URL(profile);
    if (!url.pathname.endsWith(".png")) {
      interaction.editReply(
        [
          `\`${profile}\` must be a PNG file, please try again.`,
          "Example:",
          "`/set profile:https://www.example.com/profile.png`",
        ].join("\n")
      );
      return;
    }
  } catch (e) {
    interaction.editReply(
      [
        `\`${profile}\` must be a valid URL, please try again.`,
        "Example:",
        "`/set profile:https://www.example.com/profile.png`",
      ].join("\n")
    );
    return;
  }

  store.dispatch(
    profileSet({
      characterId: interaction.user.id,
      profile,
    })
  );

  await inspect(interaction);
};

export default { command, execute };
