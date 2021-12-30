import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import store from "../../store";
import { newGame } from "../../store/actions/newGame";
import { goldSet, healthSet } from "../../store/slices/characters";

export const command = new SlashCommandBuilder()
  .setName("admin")
  .setDescription("Administrative functions.")
  .addSubcommand((option) =>
    option
      .setName("set_gold")
      .setDescription("Sets your current gold.")
      .addIntegerOption((input) =>
        input
          .setName("gold")
          .setDescription("The amount of gold you have.")
          .setRequired(true)
      )
  )
  .addSubcommand((option) =>
    option.setName("new_game").setDescription("Starts a new game.")
  )
  .addSubcommand((option) =>
    option
      .setName("set_health")
      .setDescription("Sets your current health.")
      .addIntegerOption((input) =>
        input
          .setName("hp")
          .setDescription("Health points to set.")
          .setRequired(true)
      )
  );

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  switch (interaction.options.getSubcommand()) {
    case "new_game":
      store.dispatch(newGame());
      break;
    case "set_gold":
      setGold(interaction);
      interaction.editReply("Gold set.");
      return;
    case "set_health":
      setHealth(interaction);
      interaction.editReply("Health set.");
      return;
    default:
      interaction.editReply(
        `Invalid subcommand ${interaction.options.getSubcommand()}`
      );
  }
};

const setGold = async (interaction: CommandInteraction) => {
  const gold = interaction.options.getInteger("gold");
  if (!gold) return;
  store.dispatch(
    goldSet({
      characterId: interaction.user.id,
      gold,
    })
  );
};

const setHealth = async (interaction: CommandInteraction) => {
  const hp = interaction.options.getInteger("hp");
  if (hp === null) return;
  console.log(`Setting health to ${hp}`);
  store.dispatch(
    healthSet({
      characterId: interaction.user.id,
      health: hp,
    })
  );
};

export default { command, execute };
