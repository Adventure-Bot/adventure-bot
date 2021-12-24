import { CommandInteraction } from "discord.js";
import { AttackResult } from "./AttackResult";
import { Emoji } from "../Emoji";

export function attackResultHeadline({
  interaction,
  result,
}: {
  interaction: CommandInteraction;
  result: AttackResult;
}): string {
  const { attacker, defender } = result;
  const hitsOrMisses = result.outcome === "hit" ? "hits" : "misses";
  const forDamage =
    result.outcome === "hit"
      ? `for ${Emoji(interaction, "damage")} ${result.damage} damage`
      : "";

  return `${Emoji(interaction, result.outcome)} ${
    attacker.name
  } ${hitsOrMisses} ${defender.name} ${forDamage}`;
}
