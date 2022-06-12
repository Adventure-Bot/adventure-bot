import { CommandInteraction, MessageEmbed } from 'discord.js'
import moment from 'moment'

import { Emoji } from '@adventure-bot/game/Emoji'
import {
  cooldownRemainingText,
  decoratedName,
} from '@adventure-bot/game/character'
import store from '@adventure-bot/game/store'
import { selectIsHealer } from '@adventure-bot/game/store/selectors'
import { selectStunDurationRemaining } from '@adventure-bot/game/store/selectors'
import { CharacterWithStats } from '@adventure-bot/game/store/selectors'

export function cooldownsEmbed({
  character,
}: {
  character: CharacterWithStats
  interaction: CommandInteraction
}): MessageEmbed {
  const state = store.getState()
  const embed = new MessageEmbed({
    title: `${decoratedName(character)}'s cooldowns`,
  })
  const stunDuration = selectStunDurationRemaining(state, character.id)
  if (stunDuration)
    embed.addFields([
      {
        name: 'Stunned',
        value:
          Emoji('stunned') +
          ' recovery ' +
          moment().add(stunDuration, 'milliseconds').fromNow(),
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
  if (selectIsHealer(state, character.id)) {
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
