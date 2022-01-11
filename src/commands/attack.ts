import { AttackResult } from "../attack/AttackResult";
import { attackResultEmbed } from "../attack/attackResultEmbed";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { cooldownRemainingText } from "../character/cooldownRemainingText";
import { Emoji } from "../Emoji";
import { getCharacterStatModified } from "../character/getCharacterStatModified";
import { getCharacterStatModifier } from "../character/getCharacterStatModifier";
import { getUserCharacter } from "../character/getUserCharacter";
import { loot } from "../character/loot/loot";
import { lootResultEmbed } from "../character/loot/lootResultEmbed";
import { makeAttack } from "../attack/makeAttack";
import { mentionCharacter } from "../character/mentionCharacter";
import { playerAttack } from "../attack/playerAttack";
import { SlashCommandBuilder } from "@discordjs/builders";
import { sleep } from "../utils";
import { selectCharacterById } from "../store/selectors";
import store from "../store";
import { randomArrayElement } from "../monster/randomArrayElement";

export const command = new SlashCommandBuilder()
  .setName("attack")
  .setDescription("Make an attack")
  .addUserOption((option) =>
    option.setName("target").setDescription("Whom to attack").setRequired(true)
  );

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const target = interaction.options.data[0].user;
  const initiator = interaction.user;
  if (!target) {
    await interaction.editReply(`You must specify a target @player`);
    return;
  }

  const attacker = getUserCharacter(initiator);
  const defender = getUserCharacter(target);
  let lootResult;
  if (attacker.hp === 0) {
    await interaction.editReply({
      embeds: [
        new MessageEmbed({
          description: `You're too weak to press on.`,
        }).setImage("https://imgur.com/uD06Okr.png"),
      ],
    });
    return;
  }
  const result = playerAttack(attacker.id, defender.id);
  if (!result) {
    await interaction.editReply(`No attack result. This should not happen.`);
    return;
  }

  if (result.outcome === "cooldown") {
    await interaction.editReply(
      `You can attack again ${cooldownRemainingText(
        interaction.user.id,
        "attack"
      )}.`
    );
    return;
  }
  const embeds = [attackResultEmbed({ result, interaction })];
  if (0 === selectCharacterById(store.getState(), defender.id)?.hp) {
    lootResult = loot({ looterId: attacker.id, targetId: defender.id });
    if (lootResult)
      embeds.push(lootResultEmbed({ result: lootResult, interaction }));
  }
  await interaction.editReply({
    embeds,
  });
  await sleep(2000);
  const retaliationEmbeds: MessageEmbed[] = [];
  if (0 < (selectCharacterById(store.getState(), defender.id)?.hp ?? 0)) {
    const result = makeAttack(defender.id, attacker.id);
    if (!result) {
      await interaction.editReply({
        content: `No attack result or retaliation outcome is cooldown. This should not happen.`,
      });
      return;
    }
    retaliationEmbeds.push(
      attackResultEmbed({ result, interaction, variant: "retaliation" })
    );
    if (selectCharacterById(store.getState(), defender.id)?.hp === 0) {
      lootResult = loot({ looterId: defender.id, targetId: attacker.id });
      if (lootResult)
        retaliationEmbeds.push(
          lootResultEmbed({ result: lootResult, interaction })
        );
    }

    await interaction.followUp({
      embeds: retaliationEmbeds,
    });
  }
};

export default { command, execute };

const defaultAccuracyDescriptors = {
  wideMiss: [`<@attacker> misses <@defender> utterly`],
  nearMiss: [`<@attacker> nearly misses <@defender>`],
  onTheNose: [`<@attacker> finds purchase against <@defender>`],
  veryAccurate: [`<@attacker> strikes <@defender> true`],
};

const accuracyDescriptor = (result: ReturnType<typeof playerAttack>) => {
  if (!result) return `No result`;
  if (result.outcome === "cooldown") return "On cooldown";
  const accuracy =
    result.attackRoll +
    getCharacterStatModified(result.attacker, "attackBonus") -
    getCharacterStatModified(result.defender, "ac");
  const attacker = mentionCharacter(result.attacker);
  const defender = mentionCharacter(result.defender);
  const descriptors =
    result.attacker.equipment.weapon?.accuracyDescriptors ??
    defaultAccuracyDescriptors;

  const descriptor =
    accuracy > 5
      ? descriptors.veryAccurate
      : accuracy > 0
      ? descriptors.onTheNose
      : accuracy > -2
      ? descriptors.nearMiss
      : descriptors.wideMiss;

  return randomArrayElement(descriptor)
    .replace(/<@attacker>/g, attacker)
    .replace(/<@defender>/g, defender);
};

const damageDescriptor = (result: ReturnType<typeof playerAttack>) => {
  if (!result) return `No result`;

  if (result.outcome === "cooldown" || result.outcome === "miss") return "";

  const damage = result.damage;
  switch (true) {
    case damage > 5:
      return "with a devastating blow!";
    case damage > 2:
      return "with a solid strike.";
    default:
      return "with a weak hit.";
  }
};

export const attackFlavorText = (
  result: ReturnType<typeof playerAttack>
): string =>
  result
    ? `${accuracyDescriptor(result)} ${damageDescriptor(result)}`
    : "No result";

export const attackRollText = ({
  result,
  interaction,
}: {
  result: AttackResult;
  interaction: CommandInteraction;
}): string => {
  if (!result) return "No result. This should not happen.";
  const ac = result.defender.ac;
  const acModifier = getCharacterStatModifier(result.defender, "ac");
  const roll = result.attackRoll;
  const attackBonus = getCharacterStatModified(result.attacker, "attackBonus");
  const totalAttack = roll + attackBonus;

  const acModifierText =
    acModifier > 0 ? `+${acModifier}` : acModifier < 0 ? `-${acModifier}` : ``;

  const comparison = result.outcome === "hit" ? "≥" : "<";
  return `${Emoji(interaction, "attack")}${totalAttack} ${comparison} ${Emoji(
    interaction,
    "ac"
  )}${10 + acModifier} (\`${roll}\`+${attackBonus} vs ${ac}${acModifierText})`;
};
