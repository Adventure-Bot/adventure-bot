import { CommandInteraction, MessageEmbed } from "discord.js";
import { getCharacter } from "../../character/getCharacter";
import { getMonster } from "../../monster/getMonster";
import { decoratedName } from "../../character/decoratedName";
import { hpBarField } from "../../character/hpBar/hpBarField";
import { Encounter } from "../../monster/Encounter";
import { attackResultHeadline } from "../../attack/attackResultHeadline";

export const encounterEmbed = ({
  encounter,
  interaction,
}: {
  encounter: Encounter;
  interaction: CommandInteraction;
}): MessageEmbed => {
  const character = getCharacter(encounter.characterId);
  const monster = getMonster(encounter.monsterId);

  if (!character)
    return new MessageEmbed({
      title: `Character ${encounter.characterId} not found`,
    });
  if (!monster)
    return new MessageEmbed({
      title: `Monster ${encounter.monsterId} not found`,
    });
  const embed = new MessageEmbed({
    title: `${decoratedName(character)} vs ${decoratedName(monster)}`,
    fields: [
      {
        name: "Outcome",
        value: encounter.outcome,
        inline: true,
      },
      {
        name: "Rounds",
        value: encounter.rounds.toString(),
        inline: true,
      },
    ],
    timestamp: encounter.date,
  })
    .setColor("RED")
    .setImage(monster.profile)
    .setThumbnail(character.profile);
  if (encounter.outcome === "in progress") {
    const lastPlayerAttack =
      encounter.playerAttacks[encounter.playerAttacks.length - 1];
    embed.addFields([
      hpBarField({
        character,
        showName: true,
        adjustment: -(lastPlayerAttack?.damage ?? 0),
      }),
    ]);
    if (lastPlayerAttack) {
      embed.addField(
        `${character.name}'s attack`,
        attackResultHeadline({ interaction, result: lastPlayerAttack })
      );
    }
    const lastMonsterAttack =
      encounter.monsterAttacks[encounter.monsterAttacks.length - 1];
    embed.addFields([
      hpBarField({
        character: monster,
        showName: true,
        adjustment: -(lastMonsterAttack?.damage ?? 0),
      }),
    ]);
    if (lastMonsterAttack) {
      embed.addField(
        `${monster.name}'s attack`,
        attackResultHeadline({ interaction, result: lastMonsterAttack })
      );
    }
  }
  return embed;
};
