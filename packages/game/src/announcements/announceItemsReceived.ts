import { decoratedName } from '@adventure-bot/game/character'
import {
  equipItemPrompt,
  isEquippable,
  itemEmbed,
} from '@adventure-bot/game/equipment'
import store from '@adventure-bot/game/store'
import { itemReceived } from '@adventure-bot/game/store/actions'
import { startAppListening } from '@adventure-bot/game/store/listenerMiddleware'
import { selectCharacterById } from '@adventure-bot/game/store/selectors'
import { itemPurchased } from '@adventure-bot/game/store/slices/shop'

export function announceItemsReceived(): void {
  startAppListening({
    actionCreator: itemReceived,
    effect: ({ payload: { item, interaction, characterId } }) => {
      const character = selectCharacterById(store.getState(), characterId)
      if (!character) return
      interaction.channel?.send({
        content: `${decoratedName(character)} received: ${item.name}!`,
        embeds: [itemEmbed({ item })],
      })

      if (isEquippable(item))
        equipItemPrompt({ interaction, item, showItem: false })
    },
  })
  startAppListening({
    actionCreator: itemPurchased,
    effect: ({ payload: { item, interaction, characterId } }) => {
      const character = selectCharacterById(store.getState(), characterId)
      if (!character) return
      interaction.channel?.send({
        content: `${decoratedName(character)} purchased: ${item.name}!`,
        embeds: [itemEmbed({ item })],
      })

      if (isEquippable(item))
        equipItemPrompt({ interaction, item, showItem: false })
    },
  })
}
