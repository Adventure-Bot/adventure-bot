import { CommandInteraction, MessageEmbed } from 'discord.js'

import {
  decoratedName,
  findOrCreateCharacter,
} from '@adventure-bot/game/character'
import { asset } from '@adventure-bot/game/utils'

import { Chest } from './chest'

export function chestEmbed(
  chest: Chest,
  interaction: CommandInteraction
): MessageEmbed {
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

  if (chest.disarmAttempt !== undefined)
    embed.addField(
      'Trap Disarmed',
      'You _believe_ the trap has been disabled...'
    )

  if (chest.lockFound && !chest.isLocked)
    embed.addField('Unlocked', 'The chest is unlocked.')
  if (chest.lockFound && chest.isLocked && !chest.unlockAttempt)
    embed.addField('Locked', 'The chest is locked.')
  if (chest.lockFound && chest.isLocked && chest.unlockAttempt) {
    embed.addField('Locked', 'This lock is beyond your ability.')
  }
  if (chest.trapResult) {
    embed.addField('Trap Triggered!', chest.trapResult)
  }
  return embed
}
