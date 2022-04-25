import { CommandInteraction, MessageEmbed } from 'discord.js'
import moment from 'moment'

import { Emoji } from '@adventure-bot/game/Emoji'
import {
  cooldownRemainingText,
  decoratedName,
} from '@adventure-bot/game/character'
import { stunDurationRemaining } from '@adventure-bot/game/character/cooldowns/stunDurationRemaining'
import { isHealer } from '@adventure-bot/game/heal/isHealer'
import { CharacterWithStats } from '@adventure-bot/game/store/selectors'

export function cooldownsEmbed({
  character,
}: {
  character: CharacterWithStats
  interaction: CommandInteraction
}): MessageEmbed {
  const embed = new MessageEmbed({
    title: `${decoratedName(character)}'s cooldowns`,
  })
  if (stunDurationRemaining(character))
    embed.addFields([
      {
        name: 'Stunned',
        value:
          Emoji('stunned') +
          ' recovery ' +
          moment()
            .add(stunDurationRemaining(character), 'milliseconds')
            .fromNow(),
      },
    ])
  embed.addFields([
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
      value: Emoji('heal') + ' ' + cooldownRemainingText(character.id, 'heal'),
      inline: true,
    },
  ])
  if (isHealer(character)) {
    embed.addFields([
      {
        name: 'Renew',
        value:
          Emoji('renew') + ' ' + cooldownRemainingText(character.id, 'renew'),
        inline: true,
      },
    ])
  }
  return embed
}
