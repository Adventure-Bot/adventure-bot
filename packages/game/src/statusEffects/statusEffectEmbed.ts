import { EmbedBuilder } from 'discord.js'
import moment from 'moment'

import { EmojiModifier, EmojiValue } from '@adventure-bot/game/Emoji'
import { statTitles, stats } from '@adventure-bot/game/character'
import { StatusEffect } from '@adventure-bot/game/statusEffects'

export function statusEffectEmbed(effect: StatusEffect): EmbedBuilder {
  const embed = new EmbedBuilder({
    title: effect.name,
  })

  stats.forEach((stat) => {
    const modifier = effect.modifiers?.[stat]
    if (!modifier) return
    embed.addFields({
      name: statTitles[stat],
      value: EmojiModifier(stat, modifier),
    })
  })

  if (effect.started)
    embed.addFields({
      name: 'Expires',
      value: `<t:${moment(new Date(effect.started))
        .add(effect.duration)
        .unix()}:R>`,
    })

  if (effect.ticksRemaining)
    embed.addFields({
      name: 'Ticks Remaining',
      value: effect.ticksRemaining.toString(),
    })
  const { healthAdjustment } = effect
  if (healthAdjustment && healthAdjustment > 0)
    embed.addFields({
      name: 'Heal',
      value: EmojiValue('heal', healthAdjustment),
    })
  if (healthAdjustment && healthAdjustment < 0)
    embed.addFields({
      name: 'Damage',
      value: EmojiValue('damage', healthAdjustment),
    })

  return embed
}
