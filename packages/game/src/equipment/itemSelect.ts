import { StringSelectMenuBuilder } from 'discord.js'

import { Item } from '@adventure-bot/game/equipment'
import { truncate } from '@adventure-bot/game/utils'

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
    inventory.slice(0, 24).map((item) => ({
      label: item.name,
      description: truncate(item.description, 100),
      value: item.id,
    }))
  )
