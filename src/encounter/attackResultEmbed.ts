import { CommandInteraction, MessageEmbed } from "discord.js";
import { AttackResult } from "../attack/AttackResult";
import { hpBarField } from "../character/hpBar/hpBarField";
import { Emoji } from "../Emoji";
import { attackFlavorText, attackRollText } from "../commands/attack";

export function attackResultEmbed({
  result,
  interaction,
}: {
  result: AttackResult;
  interaction: CommandInteraction;
}): MessageEmbed {
  const { attacker, defender, damage } = result;
  const hitsOrMisses = result.outcome === "hit" ? "hits" : "misses";
  const forDamage =
    result.outcome === "hit"
      ? `for ${Emoji(interaction, "damage")} ${damage} damage`
      : "";
  return new MessageEmbed({
    title: `${Emoji(interaction, result.outcome)} ${
      attacker.name
    } ${hitsOrMisses} ${defender.name} ${forDamage}`,
    description: `${attackFlavorText(result)}
    ${attackRollText({
      result,
      interaction,
    })}
    ${
      result.outcome === "hit"
        ? `${Emoji(interaction, "damage")} ${result.damageRoll} Damage`
        : ""
    }
    ${
      result.monsterDamageRoll
        ? `${Emoji(interaction, "monsterDamageMax")} ${
            result.monsterDamageRoll
          } Monster Damage`
        : ""
    }`,
    fields: [
      hpBarField({
        character: result.defender,
        adjustment: result.outcome === "hit" ? -result.damage : 0,
        showName: true,
      }),
    ],
  })
    .setThumbnail(result.attacker.profile)
    .setImage(result.defender.profile);
}
