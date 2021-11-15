import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import { playerAttack } from "../../attack/playerAttack";
import { attack } from "../../attack/attack";
import { hpBar } from "../../character/hpBar/hpBar";
import { attackFlavorText, attackRollText } from "../attack";
import { chest } from "./chest";
import { isUserQuestComplete } from "../../quest/isQuestComplete";
import quests from "../quests";
import { updateUserQuestProgess } from "../../quest/updateQuestProgess";
import { questProgressField } from "../../quest/questProgressField";
import { adjustGold } from "../../character/adjustGold";
import { awardXP } from "../../character/awardXP";
import { getCharacter } from "../../character/getCharacter";
import { getUserCharacter } from "../../character/getUserCharacter";
import { setGold } from "../../character/setGold";
import { getRandomMonster } from "../../monster/getRandomMonster";
import { createEncounter } from "../../encounter/createEncounter";
import { Monster } from "../../monster/Monster";
import { encounterInProgressEmbed } from "./encounterInProgressEmbed";
import { AttackResult } from "../../attack/AttackResult";
import { Character } from "../../character/Character";
import { Encounter } from "../../monster/Encounter";
import { adjustHP } from "../../character/adjustHP";

export const monster = async (
  interaction: CommandInteraction
): Promise<void> => {
  // TODO: explore do/while refactor
  let monster = getRandomMonster();
  let player = getUserCharacter(interaction.user);
  const encounter = createEncounter({ monster, player });
  let timeout = false;
  const message = await interaction.reply({
    embeds: [encounterInProgressEmbed(encounter)],
    fetchReply: true,
  });
  if (!(message instanceof Message)) return;

  while (encounter.outcome === "in progress") {
    encounter.rounds++;
    await message.react("⚔");
    await message.react("🏃‍♀️");
    const collected = await message
      .awaitReactions({
        filter: (reaction, user) =>
          ["⚔", "🏃‍♀️"].includes(String(reaction.emoji.name)) &&
          user.id === interaction.user.id,
        max: 1,
        time: 60000,
        errors: ["time"],
      })
      .catch(() => {
        timeout = true;
      });
    const reaction = collected?.first();
    if (
      !collected ||
      timeout ||
      !reaction ||
      (reaction && reaction.emoji.name === "🏃‍♀️")
    ) {
      encounter.outcome = "player fled";
    }

    const playerResult =
      encounter.outcome == "player fled"
        ? undefined
        : attack(player.id, monster.id);
    const monsterResult = attack(monster.id, player.id);
    playerResult && encounter.playerAttacks.push(playerResult);
    monsterResult && encounter.monsterAttacks.push(monsterResult);

    const updatedMonster = getCharacter(monster.id);
    const updatedPlayer = getCharacter(player.id);
    if (!updatedMonster || !updatedPlayer || !monsterResult) return;
    monster = updatedMonster as Monster; // todo: fixme
    player = updatedPlayer;

    const userReactions = message.reactions.cache.filter((reaction) =>
      reaction.users.cache.has(interaction.user.id)
    );

    try {
      for (const reaction of userReactions.values()) {
        await reaction.users.remove(interaction.user.id);
      }
    } catch (error) {
      console.error("Failed to remove reactions.");
    }
    switch (true) {
      case player.hp > 0 && monster.hp === 0:
        encounter.outcome = "player victory";
        awardXP(player.id, monster.xpValue);
        adjustGold(player.id, monster.gold);
        encounter.goldLooted = monster.gold;
        if (player.quests.slayer) {
          updateUserQuestProgess(interaction.user, "slayer", 1);
        }
        break;
      case player.hp === 0 && monster.hp > 0:
        encounter.outcome = "player defeated";
        setGold(player.id, 0);
        adjustGold(monster.id, player.gold);
        encounter.goldLooted = player.gold;
        awardXP(monster.id, player.xpValue);
        adjustHP(monster.id, monster.maxHP - monster.hp); // TODO: heal over time instead of immediately
        break;
      case player.hp === 0 && monster.hp === 0:
        encounter.outcome = "double ko";
        break;
      default:
        // still in progress
        break;
    }
    // if (monster.hp === 0 && player.hp > 0) {
    //   encounter.outcome = "player victory";
    //   awardXP(player.id, monster.xpValue);
    //   adjustGold(player.id, monster.gold);
    //   encounter.goldLooted = monster.gold;
    //   if (player.quests.slayer) {
    //     updateUserQuestProgess(interaction.user, "slayer", 1);
    //   }
    // }
    // if (player.hp === 0) {
    //   if (monster.hp > 0) {
    //     encounter.outcome = "player defeated";
    //     setGold(player.id, 0);
    //     adjustGold(monster.id, player.gold);
    //     encounter.goldLooted = player.gold;
    //     awardXP(monster.id, player.xpValue);
    //     adjustHP(monster.id, monster.maxHP - monster.hp); // TODO: heal over time instead of immediately
    //   }
    //   if (monster.hp === 0) {
    //     encounter.outcome = "double ko";
    //   }
    // }
    message.edit({
      embeds: [
        encounterInProgressEmbed(encounter),
        attackExchangeEmbed({
          monster,
          player,
          playerAttack: playerResult,
          monsterAttack: monsterResult,
        }),
      ],
    });
  }

  message.reactions.removeAll();

  await message.reply({
    embeds: [encounterSummaryEmbed(encounter, monster, player)],
  });

  if (encounter.outcome === "player victory" && Math.random() <= 0.3)
    await chest(interaction, true);
  if (
    isUserQuestComplete(interaction.user, "slayer") ||
    isUserQuestComplete(interaction.user, "survivor")
  )
    await quests.execute(interaction, "followUp");
};
function attackExchangeEmbed({
  monster,
  player,
  playerAttack,
  monsterAttack,
}: {
  monster: Monster;
  player: Character;
  playerAttack: AttackResult | void;
  monsterAttack: AttackResult | void;
}): MessageEmbed {
  const embed = new MessageEmbed()
    .addField(
      `${monster.name}'s HP`,
      `${hpBar(
        monster,
        playerAttack && playerAttack.outcome === "hit"
          ? -playerAttack.damage
          : 0
      )}`
    )
    .addField(
      `${player.name}'s HP`,
      `${hpBar(
        player,
        monsterAttack && monsterAttack.outcome === "hit"
          ? -monsterAttack.damage
          : 0
      )}`
    );
  if (monsterAttack) embed.addField(...attackField(monsterAttack));
  if (playerAttack) {
    embed.addField(...attackField(playerAttack));
  }
  return embed;
}

const attackField = (
  result: ReturnType<typeof playerAttack>
): [string, string] => [
  result
    ? result.outcome === "cooldown"
      ? "cooldown"
      : `${result.attacker.name}'s attack`
    : "No result.",
  result
    ? `${attackFlavorText(result)}\n${attackRollText(result)}${
        result.outcome === "hit" ? "\n🩸 " + result.damage.toString() : ""
      }`
    : "No result.",
];

function encounterSummaryEmbed(
  encounter: Encounter,
  monster: Monster,
  character: Character
): MessageEmbed {
  const summary = new MessageEmbed({ title: "Encounter Summary" });

  switch (encounter.outcome) {
    case "double ko":
      summary.addField("Double KO!", `You knocked eachother out!`);
      break;
    case "in progress":
      summary.addField("In Progress", "Encounter in progress.");
      break;
    case "monster fled":
      summary.addField("Evaded!", `${monster.name} escaped!`);
      break;
    case "player defeated":
      summary.addField("Unconscious", `${character.name} knocked out!`);
      if (encounter.goldLooted) {
        summary.addField("Looted!", `Lost 💰 ${encounter.goldLooted}!`);
      }
      break;
    case "player fled":
      summary.addField("Fled", `${character.name} escaped with their life!`);
      break;
    case "player victory":
      summary.addField(
        "Triumphant!",
        `${character.name} defeated the ${monster.name}! 🎉`
      );
      summary.addField("XP Gained", "🧠 " + monster.xpValue.toString());
      summary.addField("GP Gained", "💰 " + monster.gold.toString());
      if (character && character.quests.slayer)
        summary.addFields([questProgressField(character.quests.slayer)]);
      break;
  }

  return summary;
}
