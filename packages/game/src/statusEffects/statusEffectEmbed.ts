import { EmbedFieldData, MessageEmbed } from 'discord.js'
import moment from 'moment'

import { EmojiModifier } from '@adventure-bot/game/Emoji'
import { statTitles, stats } from '@adventure-bot/game/character'
import { StatusEffect } from '@adventure-bot/game/statusEffects'

export function statusEffectEmbed(effect: StatusEffect): MessageEmbed {
  const fields: EmbedFieldData[] = []

  stats.forEach((stat) => {
    const modifier = effect.modifiers?.[stat]
    if (!modifier) return
    fields.push({
      name: statTitles[stat],
      value: EmojiModifier(stat, modifier),
    })
  })

  if (effect.started)
    fields.push({
      name: 'Expires',
      value: moment(new Date(effect.started)).add(effect.duration).calendar(),
    })

  return new MessageEmbed({
    title: effect.name,
    fields,
  })
}
