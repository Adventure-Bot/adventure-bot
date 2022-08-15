import { MessageEmbed, TextChannel } from 'discord.js'

import { EmojiValue } from '@adventure-bot/game/Emoji'
import { sendEmbeds } from '@adventure-bot/game/announcements/sendEmbeds'
import { decoratedName } from '@adventure-bot/game/character'
import store from '@adventure-bot/game/store'
import { startAppListening } from '@adventure-bot/game/store/listenerMiddleware'
import { selectCharacterById } from '@adventure-bot/game/store/selectors'
import {
  goldGained,
  itemSold,
  looted,
} from '@adventure-bot/game/store/slices/characters'

export function announceGoldGained(channel: TextChannel): void {
  startAppListening({
    actionCreator: goldGained,
    effect: ({ payload: { characterId, amount } }) =>
      announce({ characterId, amount, channel }),
  })
  startAppListening({
    actionCreator: looted,
    effect: ({ payload: { goldTaken: amount, looterId: characterId } }) =>
      announce({ characterId, amount, channel }),
  })
  startAppListening({
    actionCreator: itemSold,
    effect: ({ payload: { characterId, sellValue } }) =>
      announce({ characterId, amount: sellValue, channel }),
  })
}

function announce({
  characterId,
  amount,
  channel,
}: {
  characterId: string
  amount: number
  channel: TextChannel
}): void {
  const character = selectCharacterById(store.getState(), characterId)
  if (!character || amount === 0) return
  const embeds = [
    new MessageEmbed({
      title: `${decoratedName(character)} gained ${EmojiValue(
        'gold',
        amount
      )} gold!`,
      description: `Total: ${EmojiValue('gold', character.gold)}`,
      color: 'YELLOW',
    }),
  ]
  sendEmbeds({ channel, embeds })
}
