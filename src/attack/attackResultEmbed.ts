import { CommandInteraction, MessageEmbed } from "discord.js";
import { AttackResult } from "./AttackResult";
import { hpBarField } from "../character/hpBar/hpBarField";
import { Emoji } from "../Emoji";
import { attackFlavorText, attackRollText } from "../commands/attack";
import { attackResultHeadline } from "./attackResultHeadline";

export function attackResultEmbed({
  result,
  interaction,
  variant = "default",
}: {
  result: AttackResult;
  interaction: CommandInteraction;
  variant?: "default" | "compact" | "retaliation";
}): MessageEmbed {
  if (variant === "compact")
    return attackResultEmbedCompact({
      result,
      interaction,
    });

  return new MessageEmbed({
    title:
      attackResultHeadline({
        interaction,
        result,
      }) + (variant === "retaliation" ? " (retaliation)" : ""),
    description: `${attackFlavorText(result)}
    ${attackRollText({
      result,
      interaction,
    })}
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

function attackResultEmbedCompact({
  result,
  interaction,
}: {
  result: AttackResult;
  interaction: CommandInteraction;
}): MessageEmbed {
  return new MessageEmbed({
    title: attackResultHeadline({
      interaction,
      result,
    }),
    description: attackFlavorText(result),
    fields: [
      hpBarField({
        character: result.defender,
        adjustment: result.outcome === "hit" ? -result.damage : 0,
        showName: true,
      }),
    ],
  }).setThumbnail(result.attacker.profile);
}
