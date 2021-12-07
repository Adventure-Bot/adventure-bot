import { SlashCommandBuilder } from "@discordjs/builders";
import { randomUUID } from "crypto";
import { CommandInteraction } from "discord.js";
import { getUserCharacter } from "../../character/getUserCharacter";
import { getUserCharacters } from "../../character/getUserCharacters";
import { updateCharacter } from "../../character/updateCharacter";

export const command = new SlashCommandBuilder()
  .setName("admin")
  .setDescription("Administrative functions.")
  .addSubcommand((option) =>
    option
      .setName("apply_item_defaults")
      .setDescription("Apply default properties to any items that lack them.")
  )
  .addSubcommand((option) =>
    option.setName("unequip_all").setDescription("Globally unequip all items.")
  )
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
    case "apply_item_defaults":
      applyItemDefaults();
      interaction.editReply("Item defaults applied.");
      return;
    case "unequip_all":
      unequipAll();
      interaction.editReply("All equipment removed.");
      return;
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
  const character = getUserCharacter(interaction.user);
  const gold = interaction.options.getInteger("gold");
  if (!gold) return;
  updateCharacter({
    ...character,
    gold,
  });
};
const setHealth = async (interaction: CommandInteraction) => {
  const character = getUserCharacter(interaction.user);
  const hp = interaction.options.getInteger("hp");
  if (hp === null) return;
  console.log(`Setting health to ${hp}`);
  updateCharacter({
    ...character,
    hp,
  });
};

const applyItemDefaults = async (): Promise<void> => {
  getUserCharacters().forEach((character) =>
    updateCharacter({
      ...character,
      inventory: character.inventory.map((item) => ({
        ...item,
        id: item.id ?? randomUUID(),
        sellable: item.sellable ?? item.name !== "heavy crown",
        tradeable: item.tradeable ?? item.name !== "heavy crown",
      })),
    })
  );
};

const unequipAll = async (): Promise<void> => {
  getUserCharacters().forEach((character) =>
    updateCharacter({
      ...character,
      equipment: {},
    })
  );
};

export default { command, execute };
