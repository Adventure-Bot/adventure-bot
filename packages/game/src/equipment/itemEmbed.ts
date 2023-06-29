import { EmbedBuilder } from 'discord.js'

import { EmojiModifier, EmojiValue } from '@adventure-bot/game/Emoji'
import { Character, statTitles, stats } from '@adventure-bot/game/character'
import { sellValue } from '@adventure-bot/game/encounters/shop/sellValue'
import { Item, isEquipped, isWeapon } from '@adventure-bot/game/equipment'

export function itemEmbed({
  item,
  saleRate,
  showEquipStatusFor,
}: {
  item: Item
  showEquipStatusFor?: Character
  saleRate?: number
}): EmbedBuilder {
  const embed = new EmbedBuilder({
    title: item.name,
    description: item.description,
  })

  stats.forEach((stat) => {
    const modifier = item.modifiers?.[stat]
    if (!modifier) return
    embed.addFields({
      name: statTitles[stat],
      value: EmojiModifier(stat, modifier),
      inline: true,
    })
  })

  if (process.env.SHOW_ITEM_IDS === 'true')
    embed.addFields([{ name: 'ID', value: item.id, inline: true }])

  if (isWeapon(item))
    embed.addFields({
      name: 'Damage',
      value: EmojiValue('damage', item.damageMax),
      inline: true,
    })

  embed.addFields([
    { name: 'Type', value: item.type, inline: true },
    { name: 'Lootable?', value: item.lootable ? 'Yes' : 'No', inline: true },
    { name: 'Sellable?', value: item.sellable ? 'Yes' : 'No', inline: true },
    { name: 'Tradeable?', value: item.tradeable ? 'Yes' : 'No', inline: true },
  ])

  if (isWeapon(item) && item.onHitEffect)
    embed.addFields([{ name: 'On Hit', value: item.onHitEffect, inline: true }])

  if (showEquipStatusFor) {
    embed.addFields([
      {
        name: 'Equipped?',
        value: isEquipped({ character: showEquipStatusFor, item })
          ? 'Yes'
          : 'No',
        inline: true,
      },
    ])
  }
  embed.addFields([
    { name: 'Gold Value', value: EmojiValue('gold', item.goldValue) },
  ])
  if (saleRate !== undefined) {
    embed.addFields([
      { name: 'Sell Value', value: EmojiValue('gold', sellValue(item)) },
    ])
  }
  return embed
}
