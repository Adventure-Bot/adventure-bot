import { CommandInteraction, Message } from 'discord.js'

import { Emoji } from '@adventure-bot/game/Emoji'
import { awardXP, findOrCreateCharacter } from '@adventure-bot/game/character'
import { statContest } from '@adventure-bot/game/character/statContest'
import { didFindCrown } from '@adventure-bot/game/crown'
import { chestEmbed } from '@adventure-bot/game/encounters/chest'
import { randomChestItem } from '@adventure-bot/game/equipment'
import { heavyCrown } from '@adventure-bot/game/equipment/items'
import { randomPotion } from '@adventure-bot/game/equipment/randomPotion'
import store from '@adventure-bot/game/store'
import { itemReceived } from '@adventure-bot/game/store/actions'
import { goldGained } from '@adventure-bot/game/store/slices/characters'
import {
  TrapWithStats,
  getRandomTrap,
  trapAttack,
} from '@adventure-bot/game/trap'
import { CommandHandlerOptions, d } from '@adventure-bot/game/utils'

export type Chest = {
  disarmAttempted: boolean
  hasLock: boolean
  hasTrap: boolean
  inspected: boolean
  locked: boolean
  looted: boolean
  disarmed: boolean
  trapped: boolean
  lockFound: boolean
  lockpickAttempted: boolean
  trap?: TrapWithStats
  trapFound: boolean
  trapResult?: string
  trapTriggered: boolean
  unlockAttempted: boolean
}

export async function chest(
  { interaction, replyType = 'followUp' }: CommandHandlerOptions,
  chestConfig?: Partial<Chest>
): Promise<void> {
  const character = findOrCreateCharacter(interaction.user)
  let fled = false
  let timeout = false

  const hasTrap = d(3) === 1
  const hasLock = d(3) === 1

  const chest: Chest = {
    disarmAttempted: false,
    hasLock,
    hasTrap,
    inspected: false,
    locked: hasLock,
    looted: false,
    disarmed: false,
    trapped: hasTrap,
    lockFound: false,
    lockpickAttempted: false,
    trap: hasTrap ? getRandomTrap() : undefined,
    trapFound: false,
    trapTriggered: false,
    unlockAttempted: false,
    ...chestConfig,
  }

  const message = await interaction[replyType]({
    embeds: [chestEmbed(chest, interaction)],
    fetchReply: true,
  })
  const messageId = message.id
  if (!(message instanceof Message)) return
  await message.react(Emoji('perception'))
  await message.react('👐')
  await message.react('🏃‍♀️')
  do {
    const collected = await message
      .awaitReactions({
        filter: (reaction, user) =>
          chestResponses(chest).includes(String(reaction.emoji.name)) &&
          user.id === interaction.user.id,
        max: 1,
        time: 60000,
        errors: ['time'],
      })
      .catch(() => {
        timeout = true
      })
    if (!collected || timeout) {
      message.reactions.removeAll()
      return
    }
    const reaction = collected.first()
    if (!reaction) {
      return
    }
    if (reaction.emoji.name === '🏃‍♀️') {
      fled = true
      break
    }
    if (!chest.inspected && reaction.emoji.name === Emoji('perception')) {
      chest.inspected = true
      message.reactions.cache.get(Emoji('perception'))?.remove()
      const perceptionCheck = statContest({
        character,
        stat: 'perception',
        difficulty: d(6) + 4,
        messageId,
        successText: chest.trapped
          ? 'spotted a trap!'
          : 'cleared the chest of any traps!',
        failureText: 'failed to spot any traps...',
      })
      if (chest.trapped && perceptionCheck.success) {
        chest.trapFound = true
        await message.react('⚙')
      }
      if (chest.locked) {
        chest.lockFound = true
        await message.react(Emoji('lockpicking'))
      }
    }
    if (!chest.disarmAttempted && reaction.emoji.name === '⚙') {
      chest.disarmAttempted = true
      message.reactions.cache.get('⚙')?.remove()

      if (
        statContest({
          character,
          stat: 'lockpicking',
          difficulty: d(6) + 4,
          messageId,
          successText: "disarmed the chest's trap!",
          failureText: "thinks the chest's trap is disabled?",
        }).success
      ) {
        chest.disarmed = true
      }
    }
    if (
      !chest.lockpickAttempted &&
      reaction.emoji.name === Emoji('lockpicking')
    ) {
      chest.lockpickAttempted = true
      message.reactions.cache.get(Emoji('lockpicking'))?.remove()

      if (
        chest.trapped &&
        !chest.disarmed &&
        !chest.trapTriggered &&
        !statContest({
          character,
          stat: 'luck',
          difficulty: d(6) + 14,
          messageId,
          successText: "luckily avoided the chest's trap!",
          failureText: "triggered the chest's trap!",
        }).success
      ) {
        triggerTrap(interaction, chest, message.id)
      }
      if (
        statContest({
          character,
          stat: 'lockpicking',
          difficulty: d(6) + 4,
          messageId,
          successText: "picked the chest's lock!",
          failureText: "failed to pick the chest's lock!",
        }).success
      ) {
        chest.locked = false
        await message.react('👐')
      } else {
        message.reactions.cache.get('👐')?.remove()
      }
    }
    if (reaction.emoji.name === '👐') {
      if (chest.trapped && !chest.disarmed) {
        triggerTrap(interaction, chest, message.id)
      }
      if (!chest.locked) chest.looted = true
      if (chest.locked) {
        chest.lockFound = true
        await message.react(Emoji('lockpicking'))
      }
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
    message.edit({
      embeds: [chestEmbed(chest, interaction)],
    })
  } while (
    !chest.looted &&
    !fled &&
    findOrCreateCharacter(interaction.user).hp > 0
  )
  message.reactions.removeAll()
  const embed = chestEmbed(chest, interaction)
  if (fled) embed.addField('Result', 'You leave the chest behind.')

  if (chest.looted && findOrCreateCharacter(interaction.user).hp > 0) {
    if (
      statContest({
        character,
        stat: 'luck',
        difficulty: d(6) + 10,
        messageId,
        successText: 'found an item in the chest!',
        failureText: 'found no items in the chest...',
      }).success
    ) {
      store.dispatch(
        itemReceived({
          characterId: interaction.user.id,
          item: randomChestItem(),
          interaction,
        })
      )
    }
    if (didFindCrown()) {
      store.dispatch(
        itemReceived({
          characterId: character.id,
          item: heavyCrown(),
          interaction,
        })
      )
    }
    if (character.equipment.ring?.name === "Alchemist's Ring") {
      store.dispatch(
        itemReceived({
          characterId: character.id,
          item: randomPotion(),
          interaction,
        })
      )
    }
    const xp = 1 + (chest.hasTrap ? 2 : 0) + (chest.hasLock ? 1 : 0)
    const gp = d(20) + 5
    awardXP({
      characterId: interaction.user.id,
      amount: xp,
    })
    store.dispatch(
      goldGained({
        amount: gp,
        characterId: interaction.user.id,
      })
    )
  }

  if (findOrCreateCharacter(interaction.user).hp === 0)
    embed.addField('Result', `You have been defeated by a chest.`)

  message.edit({
    embeds: [embed],
  })
}

function chestResponses(chest: Chest): string[] {
  const responses = []
  if (!chest.inspected) responses.push(Emoji('perception'))
  if (!chest.looted && !(chest.unlockAttempted && chest.locked))
    responses.push('👐')
  if (chest.lockFound && !chest.unlockAttempted)
    responses.push(Emoji('lockpicking'))
  if (chest.trapFound && !chest.disarmAttempted) responses.push('⚙')
  responses.push('🏃‍♀️')
  return responses
}

function triggerTrap(
  interaction: CommandInteraction,
  chest: Chest,
  messageId: string
) {
  const { trap, trapTriggered } = chest
  if (!trap || trapTriggered) return
  chest.trapTriggered = true
  trapAttack({
    interaction,
    trap,
    defender: findOrCreateCharacter(interaction.user),
    messageId,
  })
}
