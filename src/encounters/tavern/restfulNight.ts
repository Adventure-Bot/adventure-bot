import { CommandInteraction, MessageEmbed } from "discord.js";
import { awardXP } from "../../character/awardXP";
import { getUserCharacter } from "../../character/getUserCharacter";
import { hpBarField } from "../../character/hpBar/hpBarField";
import { d6 } from "../../utils/dice";
import { StatusEffect } from "../../statusEffects/StatusEffect";
import { statusEffectEmbed } from "../../statusEffects/statusEffectEmbed";
import { xpGainField } from "../../character/xpGainField";
import { clamp } from "remeda";
import { getCharacterStatModified } from "../../character/getCharacterStatModified";
import { questProgressField } from "../../quest/questProgressField";
import { isUserQuestComplete } from "../../quest/isQuestComplete";
import quests from "../../commands/quests";
import store from "../../store";
import {
  effectAdded,
  healed,
  questProgressed,
  xpAwarded,
} from "../../store/slices/characters";

export async function restfulNight(
  interaction: CommandInteraction
): Promise<void> {
  const preHealCharacter = getUserCharacter(interaction.user);
  const healAmount = d6();
  const actualHeal = clamp(healAmount, {
    max:
      getCharacterStatModified(preHealCharacter, "maxHP") - preHealCharacter.hp,
  });
  store.dispatch(xpAwarded({ characterId: interaction.user.id, amount: 1 }));
  store.dispatch(
    healed({ characterId: interaction.user.id, amount: actualHeal })
  );
  const effect: StatusEffect = {
    name: "Restful Night",
    buff: true,
    debuff: false,
    duration: 30 * 60000,
    started: new Date().toString(),
    modifiers: {
      maxHP: 2,
    },
  };

  store.dispatch(effectAdded({ characterId: interaction.user.id, effect }));
  store.dispatch(
    questProgressed({
      characterId: interaction.user.id,
      questId: "healer",
      amount: actualHeal,
    })
  );

  const character = getUserCharacter(interaction.user);
  await interaction.followUp({
    embeds: [
      new MessageEmbed({
        title: "Restful Night",
        color: "DARK_NAVY",
        description: "You feel well rested. 💤",
        fields: [
          hpBarField({
            character: getUserCharacter(interaction.user),
            adjustment: actualHeal,
          }),
          xpGainField(interaction, 1),
        ].concat(
          character.quests.healer
            ? questProgressField(character.quests.healer)
            : []
        ),
      }).setImage("https://i.imgur.com/5FAD82X.png"),
      statusEffectEmbed(effect, interaction),
    ],
  });

  if (isUserQuestComplete(interaction.user, "healer"))
    await quests.execute(interaction);
}
