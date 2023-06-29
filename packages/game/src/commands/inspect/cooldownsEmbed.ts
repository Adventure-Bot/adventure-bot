import { CommandInteraction, EmbedBuilder } from 'discord.js'
import moment from 'moment'

import { Emoji } from '@adventure-bot/game/Emoji'
import {
  cooldownRemainingText,
  decoratedName,
} from '@adventure-bot/game/character'
import store from '@adventure-bot/game/store'
import { selectStunDurationRemaining } from '@adventure-bot/game/store/selectors'
import { CharacterWithStats } from '@adventure-bot/game/store/selectors'

export function cooldownsEmbed({
  character,
}: {
  character: CharacterWithStats
  interaction: CommandInteraction
}): EmbedBuilder {
  const state = store.getState()
  const embed = new EmbedBuilder({
    title: `${decoratedName(character)}'s cooldowns`,
  })
  const stunDuration = selectStunDurationRemaining(state, character.id)
  if (stunDuration)
    embed.addFields([
      {
        name: 'Stunned',
        value: `${Emoji('stunned')} recovery <t:${moment()
          .add(stunDuration, 'milliseconds')
          .unix()}:R>`,
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
  return embed
}
