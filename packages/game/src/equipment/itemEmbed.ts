import { EmbedFieldData, MessageEmbed } from 'discord.js'

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
}): MessageEmbed {
  const fields: EmbedFieldData[] = []
  stats.forEach((stat) => {
    const modifier = item.modifiers?.[stat]
    if (!modifier) return
    fields.push({
      name: statTitles[stat],
      value: EmojiModifier(stat, modifier),
      inline: true,
    })
  })

  const embed = new MessageEmbed({
    title: item.name,
    description: item.description,
    fields: [...fields],
  })

  if (process.env.SHOW_ITEM_IDS === 'true') embed.addField('ID', item.id, true)
  if (isWeapon(item))
    embed.addField('Damage', EmojiValue('damage', item.damageMax), true)
  embed.addField('Type', item.type, true)
  embed.addField('Lootable?', item.lootable ? 'Yes' : 'No', true)
  embed.addField('Sellable?', item.sellable ? 'Yes' : 'No', true)
  embed.addField('Tradeable?', item.tradeable ? 'Yes' : 'No', true)
  if (isWeapon(item) && item.onHitEffect)
    embed.addField('On Hit', item.onHitEffect, true)

  if (showEquipStatusFor) {
    embed.addField(
      'Equipped?',
      isEquipped({ character: showEquipStatusFor, item }) ? 'Yes' : 'No',
      true
    )
  }
  embed.addField('Gold Value', EmojiValue('gold', item.goldValue))
  if (saleRate !== undefined) {
    embed.addField('Sell Value', EmojiValue('gold', sellValue(item)))
  }
  return embed
}
