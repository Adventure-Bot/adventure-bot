import { CommandInteraction } from 'discord.js'

import { Character, adjustGold } from '@adventure-bot/game/character'
import { Item } from '@adventure-bot/game/equipment'
import store from '@adventure-bot/game/store'
import { itemPurchased } from '@adventure-bot/game/store/slices/shop'

export const buyItem = async (
  interaction: CommandInteraction,
  player: Character,
  item: Item
): Promise<void> => {
  if (player.gold < item.goldValue) {
    await interaction.followUp(
      `You cannot afford the ${item.name}. You have only ${player.gold} gold and it costs ${item.goldValue}.`
    )
    return
  }
  store.dispatch(
    itemPurchased({
      characterId: player.id,
      item,
      interaction,
    })
  )
}
