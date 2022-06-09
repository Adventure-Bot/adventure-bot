import { CommandInteraction, Message } from 'discord.js'

import {
  awardXP,
  findOrCreateCharacter,
  getCharacter,
  gpGainField,
} from '@adventure-bot/game/character'
import { didFindCrown } from '@adventure-bot/game/crown'
import { chestEmbed } from '@adventure-bot/game/encounters/chest'
import { randomChestItem } from '@adventure-bot/game/equipment'
import { heavyCrown } from '@adventure-bot/game/equipment/items'
import store from '@adventure-bot/game/store'
import { itemReceived } from '@adventure-bot/game/store/actions'
import { selectCharacterById } from '@adventure-bot/game/store/selectors'
import { goldGained } from '@adventure-bot/game/store/slices/characters'
import { Trap, getRandomTrap, trapAttack } from '@adventure-bot/game/trap'
import { CommandHandlerOptions, d } from '@adventure-bot/game/utils'

export type Chest = {
  hasTrap: boolean
  trap?: Trap
  hasLock: boolean
  isTrapped: boolean
  isLocked: boolean
  lockFound: boolean
  isLooted: boolean
  trapFound: boolean
  inspected: boolean
  unlockAttempt?: number
  trapDisarmed: boolean
  disarmAttempt?: number
  trapTriggered: boolean
  trapResult?: string
}

export async function chest(
  { interaction, replyType = 'followUp' }: CommandHandlerOptions,
  chestConfig?: Partial<Chest>
): Promise<void> {
  findOrCreateCharacter(interaction.user)
  const character = selectCharacterById(store.getState(), interaction.user.id)
  if (!character) return
  const { perception, lockpicking, luck } = character.statsModified
  let fled = false
  let timeout = false

  const hasTrap = d(3) === 1
  const hasLock = d(3) === 1

  const chest: Chest = {
    hasLock,
    hasTrap,
    trap: hasTrap ? getRandomTrap() : undefined,
    isTrapped: hasTrap,
    isLocked: hasLock,
    lockFound: false,
    isLooted: false,
    trapFound: false,
    inspected: false,
    trapDisarmed: false,
    trapTriggered: false,
    ...chestConfig,
  }

  const message = await interaction[replyType]({
    embeds: [chestEmbed(chest, interaction)],
    fetchReply: true,
  })
  if (!(message instanceof Message)) return
  await message.react('👀')
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
    if (reaction.emoji.name === '👀') {
      message.reactions.cache.get('👀')?.remove()
      chest.inspected = true
      if (chest.isTrapped && d(20) + perception > 6) {
        chest.trapFound = true
        await message.react('⚙')
      }
      if (chest.isLocked) {
        chest.lockFound = true
        await message.react('🔓')
      }
    }
    if (reaction.emoji.name === '⚙') {
      message.reactions.cache.get('⚙')?.remove()
      chest.disarmAttempt = d(20) + lockpicking
      if (chest.disarmAttempt > 6) {
        chest.trapDisarmed = true
      } else {
        message.reactions.cache.get('👐')?.remove()
      }
    }
    if (reaction.emoji.name === '🔓') {
      message.reactions.cache.get('🔓')?.remove()
      chest.unlockAttempt = d(20) + lockpicking
      if (chest.isTrapped && d(20) + luck > 14) {
        triggerTrap(interaction, chest)
      }
      if (d(20) + lockpicking > 6) {
        chest.isLocked = false
        await message.react('👐')
      } else {
        message.reactions.cache.get('👐')?.remove()
      }
    }
    if (reaction.emoji.name === '👐') {
      if (chest.isTrapped) {
        triggerTrap(interaction, chest)
      }
      if (!chest.isLocked) chest.isLooted = true
      if (chest.isLocked) {
        chest.lockFound = true
        await message.react('🔓')
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
    !chest.isLooted &&
    !fled &&
    findOrCreateCharacter(interaction.user).hp > 0
  )
  message.reactions.removeAll()
  const embed = chestEmbed(chest, interaction)
  if (fled) embed.addField('Result', 'You leave the chest behind.')

  if (chest.isLooted && findOrCreateCharacter(interaction.user).hp > 0) {
    const xp = 1 + (chest.hasTrap ? 2 : 0) + (chest.hasLock ? 1 : 0)
    const gp = d(20) + 5
    awardXP(interaction.user.id, xp)
    store.dispatch(
      goldGained({
        amount: gp,
        characterId: interaction.user.id,
      })
    )
    embed.addFields([gpGainField(gp)])
    if (didFindCrown())
      store.dispatch(
        itemReceived({
          characterId: character.id,
          item: heavyCrown(),
          interaction,
        })
      )
    if (d(20) + luck > 16)
      store.dispatch(
        itemReceived({
          characterId: interaction.user.id,
          item: randomChestItem(),
          interaction,
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
  if (!chest.inspected) responses.push('👀')
  if (!chest.isLooted && !(chest.unlockAttempt && chest.isLocked))
    responses.push('👐')
  if (chest.lockFound && !chest.unlockAttempt) responses.push('🔓')
  if (chest.trapFound && !chest.disarmAttempt) responses.push('⚙')
  responses.push('🏃‍♀️')
  return responses
}

function triggerTrap(interaction: CommandInteraction, chest: Chest) {
  const { trap } = chest
  if (!trap) return
  const character = getCharacter(interaction.user.id)
  if (!character) return
  chest.trapTriggered = true
  trapAttack({ defender: character, trap })
}
