import { CommandInteraction, StringSelectMenuBuilder } from 'discord.js'

import { Item } from '@adventure-bot/game/equipment'

export function buyList({
  inventory,
}: {
  inventory: Item[]
  interaction: CommandInteraction
}): StringSelectMenuBuilder {
  return new StringSelectMenuBuilder({
    customId: 'item',
    placeholder: 'Which item would you like to buy?',
    options: inventory.map((item, i) => ({
      label: item.name,
      description: `${item.goldValue}g ${item.description}`,
      value: i.toString(),
    })),
  })
}
