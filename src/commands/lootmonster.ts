import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { characterEmbed } from "../character/characterEmbed";
import { getCharacterUpdate } from "../character/getCharacterUpdate";
import { getUserCharacter } from "../character/getUserCharacter";
import { inventoryFields } from "../character/inventoryFields";
import { loot } from "../character/loot/loot";
import { lootResultEmbed } from "../character/loot/lootResultEmbed";
import { getRandomMonster } from "../monster/getRandomMonster";
import { monsterEmbed } from "../encounters/monsterEmbed";
import { getMonsterUpdate } from "../monster/getMonsterUpdate";

export const command = new SlashCommandBuilder()
  .setName("lootmonster")
  .setDescription("Loot a random monster.");

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const monster = await getRandomMonster();
  const character = getUserCharacter(interaction.user);
  const result = loot({ looterId: character.id, targetId: monster.id });
  interaction.editReply({
    embeds: [
      monsterEmbed(getMonsterUpdate(monster)),
      characterEmbed({
        character: getCharacterUpdate(character),
        interaction,
      }).addFields(...inventoryFields(character)),
    ].concat(result ? lootResultEmbed(result) : []),
  });
};

export default { command, execute };
