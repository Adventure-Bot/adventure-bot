import { StringSelectMenuBuilder } from 'discord.js'

import { Item } from '@adventure-bot/game/equipment'

export const itemSelect = ({
  inventory,
  placeholder = 'Which item?',
}: {
  inventory: Item[]
  placeholder?: string
}): StringSelectMenuBuilder =>
  new StringSelectMenuBuilder({
    customId: 'item',
    placeholder,
  }).addOptions(
    inventory.map((item, i) => ({
      label: item.name,
      description: item.description,
      value: i.toString(),
    }))
  )
