import { CommandInteraction, MessageSelectMenu } from 'discord.js'

import { sellValue } from '@adventure-bot/game/encounters/shop/sellValue'
import { Item } from '@adventure-bot/game/equipment'
import { truncate } from '@adventure-bot/game/utils'

export function sellList({
  inventory,
}: {
  inventory: Item[]
  interaction: CommandInteraction
}): MessageSelectMenu {
  return new MessageSelectMenu({
    customId: 'item',
    placeholder: `Which item would you like to sell?`,
    options: inventory.map((item, i) => ({
      label: item.name,
      description: truncate(`${sellValue(item)}g ${item.description}`, 100),
      value: i.toString(),
    })),
  })
}
