import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { d20Emoji } from "../Emoji";
import { d } from "../utils/dice";

export const command = new SlashCommandBuilder()
  .setName("d20")
  .setDescription("Roll a d20.");

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  interaction.editReply({
    content: d20Emoji({
      interaction,
      n: d(20),
    }),
  });
};

export default { command, execute };
