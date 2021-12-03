import { CommandInteraction, EmbedFieldData, MessageEmbed } from "discord.js";
import moment from "moment";
import { stats, statTitles } from "../character/Stats";
import { Emoji } from "../Emoji";
import { StatusEffect } from "./StatusEffect";

export function statusEffectEmbed(
  effect: StatusEffect,
  interaction: CommandInteraction
): MessageEmbed {
  const fields: EmbedFieldData[] = [];

  stats.forEach((stat) => {
    const modifier = effect.modifiers[stat];
    if (!modifier) return;
    fields.push({
      name: statTitles[stat],
      value: Emoji(interaction, stat) + " " + modifier.toString(),
    });
  });

  return new MessageEmbed({
    title: effect.name,
    fields: [
      ...fields,
      {
        name: "Expires",
        value: moment(new Date(effect.started)).add(effect.duration).calendar(),
      },
    ],
  });
}
