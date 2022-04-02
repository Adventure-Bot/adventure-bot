import { CommandInteraction } from 'discord.js'

import { Character, adjustGold } from '@adventure-bot/game/character'
import {
  Item,
  equipItemPrompt,
  isEquippable,
} from '@adventure-bot/game/equipment'
import store from '@adventure-bot/game/store'
import { itemReceived } from '@adventure-bot/game/store/actions'

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
      interaction,
    })
  )
  if (isEquippable(item)) await equipItemPrompt({ interaction, item })
}
