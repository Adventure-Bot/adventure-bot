import { Message, MessageEmbed, TextChannel } from 'discord.js'

import { Emoji, EmojiValue } from '@adventure-bot/game/Emoji'
import { attackResultEmbed, makeAttack } from '@adventure-bot/game/attack'
import { findOrCreateCharacter, loot } from '@adventure-bot/game/character'
import {
  chest,
  createEncounter,
  encounterEmbed,
  encounterSummaryEmbed,
} from '@adventure-bot/game/encounters'
import { swordOfDragonSlaying } from '@adventure-bot/game/equipment/items'
import { randomMonster } from '@adventure-bot/game/monster'
import { updateQuestProgess } from '@adventure-bot/game/quest'
import store from '@adventure-bot/game/store'
import { itemReceived } from '@adventure-bot/game/store/actions'
import {
  MonsterWithStats,
  selectCharacterById,
  selectEncounterById,
  selectMonsterById,
} from '@adventure-bot/game/store/selectors'
import { damaged } from '@adventure-bot/game/store/slices/characters'
import {
  doubleKO,
  playerDefeat,
  playerFled,
  playerVictory,
  roundFinished,
} from '@adventure-bot/game/store/slices/encounters'
import { CommandHandlerOptions, d } from '@adventure-bot/game/utils'

export const monster = async ({
  interaction,
  replyType = 'editReply',
  monster = randomMonster(),
}: CommandHandlerOptions & { monster?: MonsterWithStats }): Promise<void> => {
  let player = findOrCreateCharacter(interaction.user)
  let encounter = createEncounter({ monster, player })
  const encounterId = encounter.id
  let timeout = false
  const message = await interaction[replyType]({
    embeds: [encounterEmbed({ encounterId })],
  })
  if (!(message instanceof Message)) return
  const channel = interaction.channel
  if (!(channel instanceof TextChannel)) return

  while (
    'in progress' ===
    selectEncounterById(store.getState(), encounterId)?.outcome
  ) {
    encounter = selectEncounterById(store.getState(), encounterId)
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

    if (playerFlee) store.dispatch(playerFled({ encounterId }))

    const playerResult = playerFlee
      ? undefined
      : makeAttack({
          interaction,
          attacker: player,
          defender: monster,
        })
    const monsterResult = makeAttack({
      interaction,
      attacker: monster,
      defender: player,
    })

    const updatedMonster = selectMonsterById(store.getState(), monster.id)
    if (!updatedMonster) return
    player = findOrCreateCharacter(interaction.user)
    monster = updatedMonster
    if (monster.hp === 0 && monster.statsModified.revenge > 0) {
      const revengeDamage = d(monster.statsModified.revenge)
      store.dispatch(
        damaged({
          character: player,
          amount: revengeDamage,
        })
      )
      await interaction.followUp({
        embeds: [
          new MessageEmbed({
            title: 'Revenge!',
            description: [
              monster.revengeText,
              `${player.name} took ${EmojiValue(
                'revenge',
                revengeDamage
              )} revenge damage from ${monster.name}!`,
            ]
              .filter(Boolean)
              .join('\n\n'),
          }),
        ],
      })
      player = findOrCreateCharacter(interaction.user)
    }

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
            encounterId,
            lootResult:
              (await loot({
                looterId: player.id,
                targetId: monster.id,
                interaction,
              })) ?? undefined,
          })
        )
        if (player.quests.slayer) {
          updateQuestProgess({
            interaction,
            characterId: interaction.user.id,
            questId: 'slayer',
            amount: 1,
          })
          player = selectCharacterById(store.getState(), player.id) ?? player
        }
        break
      case player.hp === 0 && monster.hp > 0:
        store.dispatch(
          playerDefeat({
            encounterId,
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
        store.dispatch(doubleKO({ encounterId }))
        break
    }

    store.dispatch(roundFinished(encounterId))
    message.edit({
      embeds: [
        encounterEmbed({
          encounterId,
        }),
      ]
        .concat(
          playerResult
            ? [
                attackResultEmbed({
                  result: playerResult,
                  variant: 'compact',
                }),
              ]
            : []
        )
        .concat(
          monsterResult
            ? attackResultEmbed({
                result: monsterResult,
                variant: 'compact',
              })
            : []
        ),
    })
  }

  message.reactions.removeAll()

  encounter = selectEncounterById(store.getState(), encounterId)
  const embed = encounterSummaryEmbed({
    encounter,
    interaction,
  })

  player = findOrCreateCharacter(interaction.user)

  const embeds = [embed]

  await message.reply({
    embeds,
  })

  if (
    player &&
    monster.kind === 'Dragon' &&
    encounter.outcome === 'player victory' &&
    Math.random() < 0.5
  ) {
    const item = swordOfDragonSlaying()
    store.dispatch(
      itemReceived({
        characterId: player.id,
        item,
        interaction,
      })
    )
  }

  if (encounter.outcome === 'player victory' && Math.random() <= 0.3)
    await chest({ interaction })
}
