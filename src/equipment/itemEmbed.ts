import { CommandInteraction, EmbedFieldData, MessageEmbed } from 'discord.js'

import { Emoji } from '@adventure-bot/Emoji'
import { getUserCharacter, statTitles, stats } from '@adventure-bot/character'
import { sellValue } from '@adventure-bot/encounters/shop/sellValue'
import { Item } from '@adventure-bot/equipment/Item'
import { goldValue } from '@adventure-bot/equipment/goldValue'
import { isEquipped } from '@adventure-bot/equipment/isEquipped'

export function itemEmbed({
  item,
  interaction,
  showEquipStatus: showEqupStatus = false,
  saleRate,
}: {
  item: Item
  interaction: CommandInteraction
  showEquipStatus?: boolean
  saleRate?: number
}): MessageEmbed {
  const fields: EmbedFieldData[] = []
  stats.forEach((stat) => {
    const modifier = item.modifiers?.[stat]
    if (!modifier) return
    fields.push({
      name: statTitles[stat],
      value: Emoji(interaction, stat) + ' ' + modifier.toString(),
      inline: true,
    })
  })

  const embed = new MessageEmbed({
    title: item.name,
    description: item.description,
    fields: [...fields],
  })

  if (process.env.SHOW_ITEM_IDS === 'true') embed.addField('ID', item.id, true)
  embed.addField('Type', item.type, true)
  embed.addField('Lootable?', item.lootable ? 'Yes' : 'No', true)
  embed.addField('Sellable?', item.sellable ? 'Yes' : 'No', true)
  embed.addField('Tradeable?', item.tradeable ? 'Yes' : 'No', true)

  if (showEqupStatus) {
    const character = getUserCharacter(interaction.user)
    embed.addField(
      'Equipped?',
      isEquipped({ character, item }) ? 'Yes' : 'No',
      true
    )
  }
  embed.addField(
    'Gold Value',
    goldValue({ goldValue: item.goldValue, interaction })
  )
  if (saleRate !== undefined) {
    embed.addField(
      'Sell Value',
      goldValue({
        goldValue: sellValue(item),
        interaction,
      })
    )
  }
  return embed
}
