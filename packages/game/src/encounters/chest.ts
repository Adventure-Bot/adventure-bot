import { CommandInteraction, Message, MessageEmbed } from 'discord.js'

import {
  adjustGold,
  awardXP,
  decoratedName,
  findOrCreateCharacter,
  getCharacter,
  gpGainField,
  xpGainField,
} from '@adventure-bot/game/character'
import { heavyCrown, randomChestItem } from '@adventure-bot/game/equipment'
import store from '@adventure-bot/game/store'
import { itemReceived } from '@adventure-bot/game/store/actions'
import { selectIsHeavyCrownInPlay } from '@adventure-bot/game/store/selectors'
import { Trap, getRandomTrap, trapAttack } from '@adventure-bot/game/trap'
import { CommandHandlerOptions, asset, d } from '@adventure-bot/game/utils'

type Chest = {
  hasTrap: boolean
  trap?: Trap
  hasLock: boolean
  isTrapped: boolean
  isLocked: boolean
  lockFound: boolean
  isLooted: boolean
  trapFound: boolean
  inspected: boolean
  unlockAttempted: boolean
  trapDisarmed: boolean
  trapDisarmAttempted: boolean
  trapTriggered: boolean
  trapResult?: string
}

export async function chest(
  { interaction, replyType = 'followUp' }: CommandHandlerOptions,
  chestConfig?: Partial<Chest>
): Promise<void> {
  let fled = false
  let timeout = false

  const hasTrap = Math.random() <= 0.7
  const hasLock = Math.random() <= 0.7

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
    unlockAttempted: false,
    trapDisarmed: false,
    trapDisarmAttempted: false,
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
      if (chest.isTrapped && Math.random() <= 0.6) {
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
      chest.trapDisarmAttempted = true
      if (d(20) > 6) {
        chest.trapDisarmed = true
      } else {
        message.reactions.cache.get('👐')?.remove()
      }
    }
    if (reaction.emoji.name === '🔓') {
      message.reactions.cache.get('🔓')?.remove()
      chest.unlockAttempted = true
      if (chest.isTrapped && Math.random() <= 0.3) {
        triggerTrap(interaction, chest)
      }
      if (Math.random() <= 0.7) {
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
    const gp = Math.floor(Math.random() * 20) + 5
    awardXP(interaction.user.id, xp)
    adjustGold(interaction.user.id, gp)
    embed.addFields([xpGainField(xp), gpGainField(gp)])
    if (Math.random() <= 0.005 && !selectIsHeavyCrownInPlay(store.getState())) {
      const crown = heavyCrown()
      const character = findOrCreateCharacter(interaction.user)
      store.dispatch(
        itemReceived({
          characterId: character.id,
          item: crown,
          interaction,
        })
      )
    }
    if (Math.random() <= 0.2) {
      const item = randomChestItem()
      store.dispatch(
        itemReceived({
          characterId: interaction.user.id,
          item,
          interaction,
        })
      )
    }
  }
  if (findOrCreateCharacter(interaction.user).hp === 0) {
    embed.addField('Result', `You have been defeated by a chest.`)
  }
  message.edit({
    embeds: [embed],
  })
}

const chestEmbed = (
  chest: Chest,
  interaction: CommandInteraction
): MessageEmbed => {
  const character = findOrCreateCharacter(interaction.user)
  const embed = new MessageEmbed({
    title: `${decoratedName(character)} encountered a chest!`,
    color: 'GOLD',
    description: `You found a treasure chest! What wonders wait within?`,
  })
    .setImage(
      asset(
        'fantasy',
        'items',
        'iron reinforced chest overflowing with gems and jewels',
        interaction.id
      ).s3Url
    )
    .setThumbnail(character.profile)

  if (chest.inspected) {
    embed.addField('Inspected', 'You inspected the chest.')
    chest.trapFound
      ? embed.addField("It's a Trap!", 'The chest is trapped.')
      : embed.addField('Trap?', "You don't _believe_ the chest is trapped...")
  }

  if (chest.trapDisarmAttempted)
    embed.addField(
      'Trap Disarmed',
      'You _believe_ the trap has been disabled...'
    )

  if (chest.lockFound && !chest.isLocked)
    embed.addField('Unlocked', 'The chest is unlocked.')
  if (chest.lockFound && chest.isLocked && !chest.unlockAttempted)
    embed.addField('Locked', 'The chest is locked.')
  if (chest.lockFound && chest.isLocked && chest.unlockAttempted) {
    embed.addField('Locked', 'This lock is beyond your ability.')
  }
  if (chest.trapResult) {
    embed.addField('Trap Triggered!', chest.trapResult)
  }
  return embed
}

const chestResponses = (chest: Chest): string[] => {
  const responses = []
  if (!chest.inspected) responses.push('👀')
  if (!chest.isLooted && !(chest.unlockAttempted && chest.isLocked))
    responses.push('👐')
  if (chest.lockFound && !chest.unlockAttempted) responses.push('🔓')
  if (chest.trapFound && !chest.trapDisarmAttempted) responses.push('⚙')
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
