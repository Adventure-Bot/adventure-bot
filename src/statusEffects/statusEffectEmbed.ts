import { CommandInteraction, EmbedFieldData, MessageEmbed } from 'discord.js'
import moment from 'moment'

import { Emoji } from '@adventure-bot/Emoji'
import { statTitles, stats } from '@adventure-bot/character/Stats'
import { StatusEffect } from '@adventure-bot/statusEffects/StatusEffect'

export function statusEffectEmbed(
  effect: StatusEffect,
  interaction: CommandInteraction
): MessageEmbed {
  const fields: EmbedFieldData[] = []

  stats.forEach((stat) => {
    const modifier = effect.modifiers[stat]
    if (!modifier) return
    fields.push({
      name: statTitles[stat],
      value: Emoji(interaction, stat) + ' ' + modifier.toString(),
    })
  })

  return new MessageEmbed({
    title: effect.name,
    fields: [
      ...fields,
      {
        name: 'Expires',
        value: moment(new Date(effect.started)).add(effect.duration).calendar(),
      },
    ],
  })
}
