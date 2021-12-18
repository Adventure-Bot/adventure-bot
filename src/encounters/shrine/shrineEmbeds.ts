import { CommandInteraction, MessageEmbed } from "discord.js";
import { getUserCharacter } from "../../character/getUserCharacter";
import { questProgressField } from "../../quest/questProgressField";
import { Shrine } from "../../shrines/Shrine";
import { statusEffectEmbed } from "../../statusEffects/statusEffectEmbed";
import { getAsset } from "../../utils/getAsset";

export function shrineEmbeds({
  shrine,
  interaction,
}: {
  shrine: Shrine;
  interaction: CommandInteraction;
}): MessageEmbed[] {
  const character = getUserCharacter(interaction.user);
  const quest = character.quests.blessed;
  return [
    new MessageEmbed({
      title: `${character.name} encounters a ${shrine.name}`,
      description: shrine.description,
      fields: quest ? [questProgressField(quest)] : [],
      color: shrine.color,
    }).setImage(
      getAsset(
        "fantasy",
        "places",
        "a beautiful glowing statue in a serene forest"
      ).s3Url()
    ),
    statusEffectEmbed(shrine.effect, interaction),
  ];
}
