import { CommandInteraction, MessageSelectMenu } from 'discord.js'

import { Item } from '@adventure-bot/game/equipment'
import { truncate } from '@adventure-bot/game/utils'

export function buyList({
  inventory,
}: {
  inventory: Item[]
  interaction: CommandInteraction
}): MessageSelectMenu {
  return new MessageSelectMenu({
    customId: 'item',
    placeholder: 'Which item would you like to buy?',
    options: inventory.map((item, i) => ({
      label: item.name,
      description: truncate(`${item.goldValue}g ${item.description}`, 100),
      value: i.toString(),
    })),
  })
}
