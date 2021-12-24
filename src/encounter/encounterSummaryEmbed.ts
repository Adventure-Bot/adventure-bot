import { CommandInteraction, MessageEmbed } from "discord.js";
import { Encounter } from "../monster/Encounter";
import { xpGainField } from "../character/xpGainField";
import { Emoji } from "../Emoji";
import { gpGainField } from "../character/gpGainField";
import { selectCharacterById, selectMonsterById } from "../store/selectors";
import store from "../store";
import { decoratedName } from "../character/decoratedName";

export function encounterSummaryEmbed({
  encounter,
  interaction,
}: {
  encounter: Encounter;
  interaction: CommandInteraction;
}): MessageEmbed {
  const embed = new MessageEmbed({});
  const state = store.getState();
  const character = selectCharacterById(state, encounter.characterId);
  if (!character) {
    embed.setTitle(`Character ${encounter.characterId} not found`);
    return embed;
  }
  const monster = selectMonsterById(state, encounter.monsterId);
  if (!monster) {
    embed.setTitle(`Monster ${encounter.monsterId} not found`);
    return embed;
  }
  embed.setTitle(`${decoratedName(character)} vs ${decoratedName(monster)}`);

  switch (encounter.outcome) {
    case "double ko":
      embed.addField("Double KO!", `You knocked eachother out!`);
      break;
    case "in progress":
      embed.addField("In Progress", "Encounter in progress!");
      break;
    case "monster fled":
      embed.addField(
        "Evaded!",
        Emoji(interaction, "run") + `${monster.name} escaped!`
      );
      break;
    case "player defeated":
      embed.addField("Unconscious", `${character.name} knocked out!`);
      break;
    case "player fled":
      embed.addField("Fled", `${character.name} escaped with their life!`);
      break;
    case "player victory":
      embed.addField(
        "Triumphant!",
        `${character.name} defeated ${monster.name}! 🎉`
      );
      embed.addFields([xpGainField(interaction, monster.xpValue)]);
      break;
  }

  if (encounter.lootResult?.goldTaken) {
    embed.addFields([gpGainField(interaction, monster.gold)]);
  }
  const itemsTaken = encounter.lootResult?.itemsTaken;
  if (itemsTaken && itemsTaken.length > 0) {
    embed.addField(
      "Items Looted",
      itemsTaken.map((item) => item.name).join(", ")
    );
  }

  return embed;
}
