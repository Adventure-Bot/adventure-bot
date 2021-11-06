import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import moment from "moment";
import {
  Character,
  defaultProfile,
  defaultProfileAttachment,
  getCharacterStatModified,
  getCharacterStatModifier,
  getUserCharacter,
  Stat,
} from "../db";
import { cooldownRemainingText } from "../utils";

export const command = new SlashCommandBuilder()
  .setName("inspect")
  .setDescription("Inspect someone.")
  .addUserOption((option) =>
    option.setName("target").setDescription("Whom to inspect")
  );

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const user =
    (interaction.options.data[0] && interaction.options.data[0].user) ||
    interaction.user;
  const character = getUserCharacter(user);
  await interaction.reply({
    attachments:
      character.profile === defaultProfile ? [defaultProfileAttachment] : [],
    embeds: [characterEmbed(character)],
    fetchReply: true,
  });
};

export default { command, execute };

export const statText = (character: Character, stat: Stat): string => {
  const modified = getCharacterStatModified(character, stat);
  const modifier = getCharacterStatModifier(character, stat);
  const sign = modifier > 0 ? "+" : "";
  return `${modified}${modifier ? ` (${sign}${modifier})` : ""}`;
};

export const characterEmbed = (character: Character): MessageEmbed => {
  const embed = new MessageEmbed()
    .setTitle(character.name)
    .setImage(character.profile)
    .addFields([
      {
        name: "HP",
        value: `🩸 ${character.hp}/${character.maxHP}`,
        inline: true,
      },
      {
        name: "AC",
        value: `🛡 ${statText(character, "ac")}`,
        inline: true,
      },
      {
        name: "Attack Bonus",
        value: `⚔ ${statText(character, "attackBonus")}`,
        inline: true,
      },
      {
        name: "Attack Available",
        value: cooldownRemainingText(character.id, "attack"),
        inline: true,
      },
      {
        name: "Adventure Available",
        value: cooldownRemainingText(character.id, "adventure"),
        inline: true,
      },
      {
        name: "Heal Available",
        value: cooldownRemainingText(character.id, "adventure"),
        inline: true,
      },
      {
        name: "XP",
        value: character.xp.toString(),
        inline: true,
      },
      {
        name: "GP",
        value: character.gold.toString(),
        inline: true,
      },
    ]);
  console.log("statModifiers", character.statModifiers);
  character.statModifiers?.forEach((effect) =>
    embed.addField(
      effect.name,
      `Expires ${moment(new Date(effect.started))
        .add(effect.duration)
        .fromNow()}`,
      true
    )
  );
  return embed;
};
