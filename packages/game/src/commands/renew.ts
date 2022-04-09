import { SlashCommandBuilder } from '@discordjs/builders'
import { Message, MessageEmbed } from 'discord.js'

import {
  cooldownRemainingText,
  findOrCreateCharacter,
  hpBarField,
  isCharacterOnCooldown,
  startCooldown,
} from '@adventure-bot/game/character'
import { isHealer } from '@adventure-bot/game/heal/isHealer'
import store from '@adventure-bot/game/store'
import { healed } from '@adventure-bot/game/store/slices/characters'
import { CommandHandlerOptions } from '@adventure-bot/game/utils'

export const command = new SlashCommandBuilder()
  .setName('renew')
  .setDescription('Heal someone over time.')
  .addUserOption((option) =>
    option.setName('target').setDescription('Whom to heal')
  )

export const execute = async ({
  interaction,
}: CommandHandlerOptions): Promise<void> => {
  const character = findOrCreateCharacter(interaction.user)

  if (!isHealer(character)) {
    interaction.editReply('You must seek the boon of the divine to use this.')
    return
  }

  if (isCharacterOnCooldown(interaction.user.id, 'renew')) {
    interaction.editReply(
      `You can use this again ${cooldownRemainingText(
        interaction.user.id,
        'renew'
      )}`
    )
    return
  }
  const target =
    (interaction.options.data[0] && interaction.options.data[0].user) ||
    interaction.user

  startCooldown({ characterId: character.id, cooldown: 'renew' })
  const healAmount = 2
  let totalTicks = 5
  const tickRate = 5 * 60000
  store.dispatch(healed({ characterId: target.id, amount: healAmount }))
  totalTicks--
  const embeds = [
    new MessageEmbed({
      title: 'Renew',
    }).setImage(
      'https://i.pinimg.com/originals/5e/b0/58/5eb0582353f354d03188da68be6865fd.jpg'
    ),
  ]
  embeds.push(
    new MessageEmbed({
      fields: [
        hpBarField({
          character: findOrCreateCharacter(target),
          adjustment: healAmount,
          showName: true,
        }),
      ],
      timestamp: new Date(),
    })
  )
  const message = await interaction.editReply({
    embeds,
  })
  if (!(message instanceof Message)) return
  console.log('renew', { healAmount, hp: findOrCreateCharacter(target).hp })
  const timer = setInterval(() => {
    store.dispatch(healed({ characterId: target.id, amount: healAmount }))
    embeds.push(
      new MessageEmbed({
        fields: [
          hpBarField({
            character: findOrCreateCharacter(target),
            adjustment: healAmount,
            showName: true,
          }),
        ],
        timestamp: new Date(),
      })
    )
    message.edit({
      embeds,
    })
    if (--totalTicks === 0) {
      clearTimeout(timer)
      message.reply('Renew finished.')
    }
  }, tickRate)
}

export default { command, execute }
