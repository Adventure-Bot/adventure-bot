import { CommandInteraction, MessageEmbed } from "discord.js";
import { getEncounters } from "../../encounter/getEncounters";
import { encounterEmbed } from "../../encounters/utils/encounterEmbed";

// TODO: shows incorrect HP current/total
export function listEncounters(interaction: CommandInteraction): void {
  const encounters = getEncounters();
  interaction.editReply({
    embeds:
      encounters.length > 0
        ? encounters
            .map((encounter) => encounterEmbed(encounter.id))
            .slice(0, 10)
        : [
            new MessageEmbed({
              description: "No encounters yet. `/adventure` to find some!",
            }),
          ],
  });
}
