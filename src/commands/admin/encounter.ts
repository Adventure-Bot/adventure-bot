import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import * as encounters from "../../encounters";
import { keys } from "remeda";

const camelToSnakeCase = (str: string) =>
  str.replace(/[A-Z]/g, (letter: string) => `_${letter.toLowerCase()}`);

// converts snake case to camel case
const snakeToCamelCase = (str: string) => {
  const words = str.split("_");
  return words.reduce((acc, word, index) => {
    if (index === 0) {
      return word;
    }
    return `${acc}${word[0].toUpperCase()}${word.slice(1)}`;
  }, "");
};

export const command = new SlashCommandBuilder()
  .setName("encounter")
  .setDescription("Trigger a specific encounter");

keys(encounters)
  .map(camelToSnakeCase)
  .forEach((encounterName) => {
    command.addSubcommand((option) =>
      option
        .setName(encounterName)
        .setDescription(`Trigger the ${encounterName} encounter`)
    );
  });

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const encounterName = snakeToCamelCase(interaction.options.getSubcommand());
  const encounterNames = keys(encounters);
  if (encounterNames.includes(encounterName)) {
    // @ts-ignore
    const encounter = encounters[encounterName];
    console.log(encounter);
    await encounter(interaction);
  }
};

export default { command, execute };
