import { StringSelectMenuBuilder } from 'discord.js'

import { sellValue } from '@adventure-bot/game/encounters/shop/sellValue'
import { Item, isEquipped } from '@adventure-bot/game/equipment'
import { CharacterWithStats } from '@adventure-bot/game/store/selectors'
import { truncate } from '@adventure-bot/game/utils'

export function sellList({
  inventory,
  character,
}: {
  inventory: Item[]
  character: CharacterWithStats
}): StringSelectMenuBuilder {
  return new StringSelectMenuBuilder({
    customId: 'item',
    placeholder: `Which item would you like to sell?`,
    options: inventory.slice(0, 24).map((item) => ({
      label: item.name + (isEquipped({ item, character }) ? ' (equipped)' : ''),
      description: truncate(`${sellValue(item)}g ${item.description}`, 100),
      value: item.id,
    })),
  })
}
