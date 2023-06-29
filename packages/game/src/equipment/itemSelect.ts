import { MessageSelectMenu } from 'discord.js'

import { Item } from '@adventure-bot/game/equipment'
import { truncate } from '@adventure-bot/game/utils'

export const itemSelect = ({
  inventory,
  placeholder = 'Which item?',
}: {
  inventory: Item[]
  placeholder?: string
}): MessageSelectMenu =>
  new MessageSelectMenu({
    customId: 'item',
    placeholder,
  }).addOptions(
    inventory.map((item, i) => ({
      label: item.name,
      description: truncate(item.description, 100),
      value: i.toString(),
    }))
  )
