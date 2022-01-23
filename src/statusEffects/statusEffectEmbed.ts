import { EmbedFieldData, MessageEmbed } from 'discord.js'
import moment from 'moment'

import { EmojiModifier } from '@adventure-bot/Emoji'
import { statTitles, stats } from '@adventure-bot/character'
import { StatusEffect } from '@adventure-bot/statusEffects'

export function statusEffectEmbed(effect: StatusEffect): MessageEmbed {
  const fields: EmbedFieldData[] = []

  stats.forEach((stat) => {
    const modifier = effect.modifiers[stat]
    if (!modifier) return
    fields.push({
      name: statTitles[stat],
      value: EmojiModifier(stat, modifier),
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
