import {
  CommandInteraction,
  Message,
  MessageAttachment,
  MessageEmbed,
} from 'discord.js'
import { adjustGold } from '@adventure-bot/character/adjustGold'
import { awardXP } from '@adventure-bot/character/awardXP'
import { getUserCharacter } from '@adventure-bot/character/getUserCharacter'
import { gpGainField } from '@adventure-bot/character/gpGainField'
import { xpGainField } from '@adventure-bot/character/xpGainField'
import { equipItemPrompt } from '@adventure-bot/equipment/equipItemPrompt'
import { itemEmbed } from '@adventure-bot/equipment/itemEmbed'
import { randomChestItem } from '@adventure-bot/equipment/randomChestItem'
import { heavyCrown } from '@adventure-bot/equipment/items/heavyCrown'
import { trapAttack } from '@adventure-bot/trap/trapAttack'
import { isEquippable } from '@adventure-bot/equipment/equipment'
import { selectIsHeavyCrownInPlay } from '@adventure-bot/store/selectors'
import store from '@adventure-bot/store'
import { damaged, effectAdded } from '@adventure-bot/store/slices/characters'
import { itemReceived } from '@adventure-bot/store/actions'

const chestImage = new MessageAttachment('./images/chest.jpg', 'chest.jpg')

type Chest = {
  hasTrap: boolean
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
  interaction: CommandInteraction,
  chestConfig?: Partial<Chest>
): Promise<void> {
  let fled = false
  let timeout = false

  const hasTrap = Math.random() <= 0.7
  const hasLock = Math.random() <= 0.7

  const chest: Chest = {
    hasLock,
    hasTrap,
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

  const message = await interaction.followUp({
    files: [chestImage],
    embeds: [chestEmbed(chest)],
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
      await interaction.followUp(`Timed out`)
      return
    }
    const reaction = collected.first()
    if (!reaction) {
      await interaction.followUp(`No reaction received.`)
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
      if (Math.random() <= 0.7) {
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
      files: [chestImage],
      embeds: [chestEmbed(chest)],
    })
  } while (
    !chest.isLooted &&
    !fled &&
    getUserCharacter(interaction.user).hp > 0
  )
  message.reactions.removeAll()
  const embed = chestEmbed(chest)
  if (fled) embed.addField('Result', 'You leave the chest behind.')

  if (chest.isLooted && getUserCharacter(interaction.user).hp > 0) {
    const xp = 1 + (chest.hasTrap ? 2 : 0) + (chest.hasLock ? 1 : 0)
    const gp = Math.floor(Math.random() * 20) + 5
    awardXP(interaction.user.id, xp)
    adjustGold(interaction.user.id, gp)
    embed.addFields([
      xpGainField(interaction, xp),
      gpGainField(interaction, gp),
    ])
    if (Math.random() <= 0.005 && !selectIsHeavyCrownInPlay(store.getState())) {
      const crown = heavyCrown()
      const character = getUserCharacter(interaction.user)
      store.dispatch(
        itemReceived({
          characterId: character.id,
          item: crown,
        })
      )
      embed.addField(
        'Heavy Crown',
        `You have found the heavy crown. ${crown.description}`
      )
      await interaction.followUp({
        embeds: [itemEmbed({ item: crown, interaction })],
      })
      await equipItemPrompt({ interaction, item: crown })
    }
    if (Math.random() <= 0.2) {
      const item = randomChestItem()
      store.dispatch(
        itemReceived({
          characterId: interaction.user.id,
          item,
        })
      )
      await interaction.followUp({
        embeds: [itemEmbed({ item, interaction })],
      })
      if (isEquippable(item))
        equipItemPrompt({ interaction, item, showItem: false })
    }
  }
  if (getUserCharacter(interaction.user).hp === 0) {
    embed.addField('Result', `You have been defeated by a chest.`)
  }
  message.edit({
    files: [chestImage],
    embeds: [embed],
  })
}

const chestEmbed = (chest: Chest): MessageEmbed => {
  const embed = new MessageEmbed({
    title: 'A chest!',
    color: 'GOLD',
    description: `You found a treasure chest! What wonders wait within?`,
  }).setImage('attachment://chest.jpg')

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
  chest.trapTriggered = true
  const attack = trapAttack(interaction.user.id, 1)
  if (!attack)
    return interaction.editReply('No attack. This should not happen.')

  if (attack.outcome === 'hit') {
    const roll = Math.random()

    store.dispatch(
      damaged({
        characterId: interaction.user.id,
        amount: attack.damage,
      })
    )
    switch (true) {
      case roll <= 0.5:
        store.dispatch(
          effectAdded({
            characterId: interaction.user.id,
            effect: {
              name: 'Poison Trap',
              debuff: true,
              buff: false,
              modifiers: {
                attackBonus: -2,
              },
              duration: 30 * 60000,
              started: new Date().toString(),
            },
          })
        )
        chest.trapResult = `A needle pricks your finger. You take ${attack.damage} damage and feel ill!`
        break
      default:
        store.dispatch(
          effectAdded({
            characterId: interaction.user.id,
            effect: {
              name: 'Slow Trap',
              debuff: true,
              buff: false,
              modifiers: {
                ac: -2,
              },
              duration: 30 * 60000,
              started: new Date().toString(),
            },
          })
        )
        chest.trapResult = `A strange dust explodes in your face. You take ${attack.damage} damage and feel sluggish!`
        break
    }
  }
}
