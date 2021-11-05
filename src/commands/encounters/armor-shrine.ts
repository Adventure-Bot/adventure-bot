import { CommandInteraction, MessageEmbed } from "discord.js";
import moment from "moment";
import { grantStatusEffect, StatModifier } from "../../db";

export const armorShrine = async (
  interaction: CommandInteraction
): Promise<void> => {
  const effect: StatModifier = {
    name: "Shrine of Protection",
    modifiers: {
      ac: 2,
    },
    duration: 30 * 60000,
    started: new Date().toString(),
  };
  grantStatusEffect(interaction.user.id, effect);
  await interaction.reply({
    embeds: [
      new MessageEmbed()
        .setTitle("Shrine of Protection")
        .setColor("GREEN")
        .setDescription(`The shrine grants you +${effect.modifiers.ac} ac!`)
        .addField(
          "Expires",
          moment(new Date(effect.started)).add(effect.duration).fromNow()
        )
        .setImage("https://i.imgur.com/mfDAYcQ.png"),
    ],
  });
};
