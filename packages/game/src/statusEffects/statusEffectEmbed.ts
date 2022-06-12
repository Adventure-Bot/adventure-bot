import { EmbedFieldData, MessageEmbed } from 'discord.js'
import moment from 'moment'

import { EmojiModifier, EmojiValue } from '@adventure-bot/game/Emoji'
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

  if (effect.ticksRemaining)
    fields.push({
      name: 'Ticks Remaining',
      value: effect.ticksRemaining.toString(),
    })
  const { healthAdjustment } = effect
  if (healthAdjustment && healthAdjustment > 0)
    fields.push({
      name: 'Heal',
      value: EmojiValue('heal', healthAdjustment),
    })
  if (healthAdjustment && healthAdjustment < 0)
    fields.push({
      name: 'Damage',
      value: EmojiValue('damage', healthAdjustment),
    })

  return new MessageEmbed({
    title: effect.name,
    fields,
  }).setColor(effect.announcementColor)
}
