import { CommandInteraction, Message, TextChannel } from 'discord.js'

import { Emoji } from '@adventure-bot/game/Emoji'
import { attackResultEmbed, makeAttack } from '@adventure-bot/game/attack'
import { decoratedName, loot } from '@adventure-bot/game/character'
import { getHook } from '@adventure-bot/game/commands/inspect/getHook'
import quests from '@adventure-bot/game/commands/quests'
import {
  chest,
  createEncounter,
  encounterEmbed,
  encounterSummaryEmbed,
} from '@adventure-bot/game/encounters'
import { randomMonster } from '@adventure-bot/game/monster'
import {
  isUserQuestComplete,
  questProgressField,
  updateUserQuestProgess,
} from '@adventure-bot/game/quest'
import store from '@adventure-bot/game/store'
import {
  selectCharacterById,
  selectEncounterById,
  selectMonsterById,
} from '@adventure-bot/game/store/selectors'
import {
  doubleKO,
  playerDefeat,
  playerFled,
  playerVictory,
  roundFinished,
} from '@adventure-bot/game/store/slices/encounters'

export const monster = async (
  interaction: CommandInteraction
): Promise<void> => {
  // TODO: explore do/while refactor
  let monster = randomMonster()
  let player = selectCharacterById(store.getState(), interaction.user.id)
  if (!player) return

  console.log('monster encounter', monster, player)
  let encounter = createEncounter({ monster, player })
  console.log('selected encounter', encounter)
  let timeout = false
  const message = await interaction.editReply({
    embeds: [encounterEmbed({ encounter, interaction })],
  })
  if (!(message instanceof Message)) return
  const channel = interaction.channel
  if (!(channel instanceof TextChannel)) return

  const thread = await channel.threads.create({
    name: `Combat log for ${decoratedName(player)} vs ${decoratedName(
      monster
    )}`,
    startMessage: message,
  })

  const hook = await getHook({
    name: 'Combat',
    channel,
  })

  while (
    'in progress' ===
    selectEncounterById(store.getState(), encounter.id)?.outcome
  ) {
    encounter = selectEncounterById(store.getState(), encounter.id)
    await message.react(Emoji('attack'))
    await message.react(Emoji('run'))
    const collected = await message
      .awaitReactions({
        filter: (reaction, user) =>
          [Emoji('attack'), 'attack', Emoji('run'), 'run'].includes(
            reaction.emoji.name ?? ''
          ) && user.id === interaction.user.id,
        max: 1,
        time: 60000,
        errors: ['time'],
      })
      .catch(() => {
        timeout = true
      })
    const reaction = collected?.first()

    const playerFlee =
      !collected ||
      timeout ||
      !reaction ||
      [Emoji('run'), 'run'].includes(reaction.emoji.name ?? '')

    if (playerFlee) store.dispatch(playerFled({ encounterId: encounter.id }))

    const playerResult = playerFlee
      ? undefined
      : makeAttack(player.id, monster.id, encounter.id)
    if (playerResult) {
      hook?.send({
        embeds: [attackResultEmbed({ result: playerResult, interaction })],
        threadId: thread.id,
      })
    }
    const monsterResult = makeAttack(monster.id, player.id, encounter.id)
    if (monsterResult) {
      hook?.send({
        embeds: [attackResultEmbed({ result: monsterResult, interaction })],
        threadId: thread.id,
      })
    }

    const updatedMonster = selectMonsterById(store.getState(), monster.id)
    player = selectCharacterById(store.getState(), player.id)
    if (!player || !updatedMonster) return
    monster = updatedMonster

    const userReactions = message.reactions.cache.filter((reaction) =>
      reaction.users.cache.has(interaction.user.id)
    )

    try {
      for (const reaction of userReactions.values()) {
        await reaction.users.remove(interaction.user.id)
      }
    } catch (error) {
      console.error('Failed to remove reactions.')
    }
    switch (true) {
      case player.hp > 0 && monster.hp === 0:
        store.dispatch(
          playerVictory({
            encounterId: encounter.id,
            lootResult:
              (await loot({
                looterId: player.id,
                targetId: monster.id,
                interaction,
              })) ?? undefined,
          })
        )
        if (player.quests.slayer) {
          updateUserQuestProgess(interaction.user, 'slayer', 1)
        }
        break
      case player.hp === 0 && monster.hp > 0:
        store.dispatch(
          playerDefeat({
            encounterId: encounter.id,
            lootResult:
              (await loot({
                looterId: monster.id,
                targetId: player.id,
                interaction,
              })) ?? undefined,
          })
        )
        break
      case player.hp === 0 && monster.hp === 0:
        store.dispatch(doubleKO({ encounterId: encounter.id }))
        break
    }

    store.dispatch(roundFinished(encounter.id))
    encounter = selectEncounterById(store.getState(), encounter.id)
    message.edit({
      embeds: [encounterEmbed({ encounter, interaction })]
        .concat(
          playerResult
            ? [
                attackResultEmbed({
                  result: playerResult,
                  interaction,
                  variant: 'compact',
                }),
              ]
            : []
        )
        .concat(
          monsterResult
            ? attackResultEmbed({
                result: monsterResult,
                interaction,
                variant: 'compact',
              })
            : []
        ),
    })
  }

  message.reactions.removeAll()

  encounter = selectEncounterById(store.getState(), encounter.id)
  const embed = encounterSummaryEmbed({
    encounter,
    interaction,
  })
  if (player.quests.slayer && encounter.outcome === 'player victory')
    embed.addFields([questProgressField(player.quests.slayer)])

  const embeds = [embed]

  await message.reply({
    embeds,
  })

  hook
    ?.send({
      embeds,
      threadId: thread.id,
    })
    .then(() => {
      thread.setArchived(true)
    })

  if (encounter.outcome === 'player victory' && Math.random() <= 0.3)
    await chest(interaction)
  if (
    isUserQuestComplete(interaction.user, 'slayer') ||
    isUserQuestComplete(interaction.user, 'survivor')
  )
    await quests.execute(interaction)
}
