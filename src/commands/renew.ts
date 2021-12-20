import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import { isCharacterOnCooldown } from "../character/isCharacterOnCooldown";
import { getUserCharacter } from "../character/getUserCharacter";
import { cooldownRemainingText } from "../character/cooldownRemainingText";
import { hpBarField } from "../character/hpBar/hpBarField";
import { adjustHP } from "../character/adjustHP";
import { setCharacterCooldown } from "../character/setCharacterCooldown";
import { isHealer } from "../heal/isHealer";

export const command = new SlashCommandBuilder()
  .setName("renew")
  .setDescription("Heal someone over time.")
  .addUserOption((option) =>
    option.setName("target").setDescription("Whom to heal").setRequired(true)
  );

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const character = getUserCharacter(interaction.user);

  if (!isHealer(character)) {
    interaction.editReply("You must seek the boon of the divine to use this.");
    return;
  }

  if (isCharacterOnCooldown(interaction.user.id, "renew")) {
    interaction.editReply(
      `You can use this again ${cooldownRemainingText(
        interaction.user.id,
        "renew"
      )}`
    );
    return;
  }
  const target = interaction.options.data[0].user;
  if (!target) {
    await interaction.editReply(`You must specify a target @player`);
    return;
  }
  setCharacterCooldown(character.id, "renew");
  const healAmount = 2;
  let totalTicks = 5;
  const tickRate = 5 * 60000;
  adjustHP(target.id, healAmount);
  totalTicks--;
  const embeds = [
    new MessageEmbed({
      title: "Renew",
    }).setImage(
      "https://i.pinimg.com/originals/5e/b0/58/5eb0582353f354d03188da68be6865fd.jpg"
    ),
  ];
  embeds.push(
    new MessageEmbed({
      fields: [
        hpBarField({
          character: getUserCharacter(target),
          adjustment: healAmount,
          showName: true,
        }),
      ],
      timestamp: new Date(),
    })
  );
  const message = await interaction.editReply({
    embeds,
  });
  if (!(message instanceof Message)) return;
  console.log("renew", { healAmount, hp: getUserCharacter(target).hp });
  const timer = setInterval(() => {
    adjustHP(target.id, healAmount);
    embeds.push(
      new MessageEmbed({
        fields: [
          hpBarField({
            character: getUserCharacter(target),
            adjustment: healAmount,
            showName: true,
          }),
        ],
        timestamp: new Date(),
      })
    );
    message.edit({
      embeds,
    });
    if (--totalTicks === 0) {
      clearTimeout(timer);
      message.reply("Renew finished.");
    }
  }, tickRate);
};

export default { command, execute };
