import { CommandInteraction } from 'discord.js'

import { Character } from '@adventure-bot/character'
import { adjustGold } from '@adventure-bot/character/adjustGold'
import { Item } from '@adventure-bot/equipment/Item'
import { equipItemPrompt } from '@adventure-bot/equipment/equipItemPrompt'
import store from '@adventure-bot/store'
import { itemReceived } from '@adventure-bot/store/actions'

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
  adjustGold(player.id, -item.goldValue)
  store.dispatch(
    itemReceived({
      characterId: player.id,
      item,
    })
  )
  await equipItemPrompt({ interaction, item })
}
