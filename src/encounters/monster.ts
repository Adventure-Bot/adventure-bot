import { CommandInteraction, Message, TextChannel } from "discord.js";
import { makeAttack } from "../attack/makeAttack";
import { chest } from "./chest";
import { isUserQuestComplete } from "../quest/isQuestComplete";
import quests from "../commands/quests";
import { updateUserQuestProgess } from "../quest/updateQuestProgess";
import { getUserCharacter } from "../character/getUserCharacter";
import { getRandomMonster } from "../monster/getRandomMonster";
import { createEncounter } from "../encounter/createEncounter";
import { loot } from "../character/loot/loot";
import { lootResultEmbed } from "../character/loot/lootResultEmbed";
import store from "../store";
import {
  roundFinished as roundFinished,
  doubleKO,
  playerDefeat,
  playerFled,
  playerVictory,
} from "../store/slices/encounters";
import { Emoji } from "../Emoji";
import { attackResultEmbed } from "../attack/attackResultEmbed";
import { encounterSummaryEmbed } from "../encounter/encounterSummaryEmbed";
import { encounterEmbed } from "./utils/encounterEmbed";
import { getHook } from "../commands/inspect/getHook";
import {
  selectCharacterById,
  selectEncounterById,
  selectMonsterById,
} from "../store/selectors";
import { decoratedName } from "../character/decoratedName";
import { questProgressField } from "../quest/questProgressField";

export const monster = async (
  interaction: CommandInteraction
): Promise<void> => {
  // TODO: explore do/while refactor
  let monster = await getRandomMonster();
  let player = getUserCharacter(interaction.user);

  console.log("monster encounter", monster, player);
  let encounter = createEncounter({ monster, player });
  console.log("selected encounter", encounter);
  let timeout = false;
  const message = await interaction.editReply({
    embeds: [encounterEmbed({ encounter, interaction })],
  });
  if (!(message instanceof Message)) return;
  const channel = interaction.channel;
  if (!(channel instanceof TextChannel)) return;

  const thread = await channel.threads.create({
    name: `Combat log for ${decoratedName(player)} vs ${decoratedName(
      monster
    )}`,
    startMessage: message,
  });

  const webhooks = await channel.fetchWebhooks();
  const hook = await getHook({
    name: "Combat",
    webhooks,
    interaction,
  });

  while (
    "in progress" ===
    selectEncounterById(store.getState(), encounter.id)?.outcome
  ) {
    encounter = selectEncounterById(store.getState(), encounter.id);
    const attackEmoji = Emoji(interaction, "attack");
    const runEmoji = Emoji(interaction, "run");
    await message.react(attackEmoji);
    await message.react(runEmoji);
    const collected = await message
      .awaitReactions({
        filter: (reaction, user) =>
          [attackEmoji, "attack", runEmoji, "run"].includes(
            reaction.emoji.name ?? ""
          ) && user.id === interaction.user.id,
        max: 1,
        time: 60000,
        errors: ["time"],
      })
      .catch(() => {
        timeout = true;
      });
    const reaction = collected?.first();

    const playerFlee =
      !collected ||
      timeout ||
      !reaction ||
      [runEmoji, "run"].includes(reaction.emoji.name ?? "");

    if (playerFlee) store.dispatch(playerFled({ encounterId: encounter.id }));

    const playerResult = playerFlee
      ? undefined
      : makeAttack(player.id, monster.id, encounter.id);
    if (playerResult) {
      hook?.send({
        embeds: [attackResultEmbed({ result: playerResult, interaction })],
        threadId: thread.id,
      });
    }
    const monsterResult = makeAttack(monster.id, player.id, encounter.id);
    if (monsterResult) {
      hook?.send({
        embeds: [attackResultEmbed({ result: monsterResult, interaction })],
        threadId: thread.id,
      });
    }

    const updatedMonster = selectMonsterById(store.getState(), monster.id);
    const updatedPlayer = selectCharacterById(store.getState(), player.id);
    if (!updatedMonster || !updatedPlayer || !monsterResult) return;
    monster = updatedMonster;
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
        store.dispatch(
          playerVictory({
            encounterId: encounter.id,
            lootResult:
              loot({
                looterId: player.id,
                targetId: monster.id,
              }) ?? undefined,
          })
        );
        if (player.quests.slayer) {
          updateUserQuestProgess(interaction.user, "slayer", 1);
        }
        break;
      case player.hp === 0 && monster.hp > 0:
        store.dispatch(
          playerDefeat({
            encounterId: encounter.id,
            lootResult:
              loot({
                looterId: monster.id,
                targetId: player.id,
              }) ?? undefined,
          })
        );
        break;
      case player.hp === 0 && monster.hp === 0:
        store.dispatch(doubleKO({ encounterId: encounter.id }));
        break;
    }

    encounter = selectEncounterById(store.getState(), encounter.id);
    message.edit({
      embeds: [encounterEmbed({ encounter, interaction })]
        .concat(
          playerResult
            ? [
                attackResultEmbed({
                  result: playerResult,
                  interaction,
                  variant: "compact",
                }),
              ]
            : []
        )
        .concat(
          monsterResult
            ? attackResultEmbed({
                result: monsterResult,
                interaction,
                variant: "compact",
              })
            : []
        ),
    });
    store.dispatch(roundFinished(encounter.id));
  }

  message.reactions.removeAll();

  encounter = selectEncounterById(store.getState(), encounter.id);

  const embed = encounterSummaryEmbed({
    encounter,
    interaction,
  });

  if (player.quests.slayer && encounter.outcome === "player victory")
    embed.addFields([questProgressField(player.quests.slayer)]);

  const embeds = [embed].concat(
    encounter.lootResult ? lootResultEmbed(encounter.lootResult) : []
  );

  await message.reply({
    embeds,
  });

  hook
    ?.send({
      embeds,
      threadId: thread.id,
    })
    .then(() => {
      thread.setArchived(true);
    });

  if (encounter.outcome === "player victory" && Math.random() <= 0.3)
    await chest(interaction);
  if (
    isUserQuestComplete(interaction.user, "slayer") ||
    isUserQuestComplete(interaction.user, "survivor")
  )
    await quests.execute(interaction);
};
