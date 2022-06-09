import { MessageEmbed, TextChannel } from 'discord.js'

import { EmojiValue } from '@adventure-bot/game/Emoji'
import { decoratedName } from '@adventure-bot/game/character'
import store from '@adventure-bot/game/store'
import { startAppListening } from '@adventure-bot/game/store/listenerMiddleware'
import { selectCharacterById } from '@adventure-bot/game/store/selectors'
import { goldGained } from '@adventure-bot/game/store/slices/characters'

export function announceGoldGained({
  channel,
}: {
  channel: TextChannel
}): void {
  startAppListening({
    actionCreator: goldGained,
    effect: ({ payload: { characterId, amount } }) => {
      const character = selectCharacterById(store.getState(), characterId)
      if (!character) return
      const embeds = [
        new MessageEmbed({
          title: `${decoratedName(character)} gained ${EmojiValue(
            'gold',
            amount
          )} gold!`,
          color: 'YELLOW',
        }),
      ]
      channel.send({
        embeds,
      })
    },
  })
}
