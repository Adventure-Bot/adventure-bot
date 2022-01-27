import { CommandInteraction, MessageEmbed } from 'discord.js'

import { Emoji } from '@adventure-bot/Emoji'
import { Character, cooldownRemainingText } from '@adventure-bot/character'
import { isHealer } from '@adventure-bot/heal/isHealer'

export function actionEmbed({
  character,
}: {
  character: Character
  interaction: CommandInteraction
}): MessageEmbed {
  const fields = [
    {
      name: 'Attack',
      value:
        Emoji('attack') + ' ' + cooldownRemainingText(character.id, 'attack'),
      inline: true,
    },
    {
      name: 'Adventure',
      value:
        Emoji('adventure') +
        ' ' +
        cooldownRemainingText(character.id, 'adventure'),
      inline: true,
    },
    {
      name: 'Heal',
      value:
        Emoji('heal') + ' ' + cooldownRemainingText(character.id, 'adventure'),
      inline: true,
    },
  ]
  if (isHealer(character)) {
    fields.push({
      name: 'Renew',
      value:
        Emoji('renew') + ' ' + cooldownRemainingText(character.id, 'renew'),
      inline: true,
    })
  }
  return new MessageEmbed({
    title: 'Actions',
    fields,
  })
}
