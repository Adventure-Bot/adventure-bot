import { CommandInteraction, MessageEmbed } from "discord.js";
import { Character } from "../../character/Character";
import { cooldownRemainingText } from "../../character/cooldowns/cooldownRemainingText";
import { Emoji } from "../../Emoji";
import { isHealer } from "../../heal/isHealer";

export function actionEmbed({
  character,
  interaction,
}: {
  character: Character;
  interaction: CommandInteraction;
}): MessageEmbed {
  const fields = [
    {
      name: "Attack",
      value:
        Emoji(interaction, "attack") +
        " " +
        cooldownRemainingText(character.id, "attack"),
      inline: true,
    },
    {
      name: "Adventure",
      value:
        Emoji(interaction, "adventure") +
        " " +
        cooldownRemainingText(character.id, "adventure"),
      inline: true,
    },
    {
      name: "Heal",
      value:
        Emoji(interaction, "heal") +
        " " +
        cooldownRemainingText(character.id, "adventure"),
      inline: true,
    },
  ];
  if (isHealer(character)) {
    fields.push({
      name: "Renew",
      value:
        Emoji(interaction, "renew") +
        " " +
        cooldownRemainingText(character.id, "renew"),
      inline: true,
    });
  }
  return new MessageEmbed({
    title: "Actions",
    fields,
  });
}
