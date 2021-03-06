import { MessageEmbed, TextChannel } from 'discord.js'

import { EmojiValue } from '@adventure-bot/game/Emoji'
import { decoratedName } from '@adventure-bot/game/character'
import store from '@adventure-bot/game/store'
import { startAppListening } from '@adventure-bot/game/store/listenerMiddleware'
import { selectCharacterById } from '@adventure-bot/game/store/selectors'
import { xpAwarded } from '@adventure-bot/game/store/slices/characters'

import { sendEmbeds } from './sendEmbeds'

export function announceXpAwarded(channel: TextChannel): void {
  startAppListening({
    actionCreator: xpAwarded,
    effect: async ({ payload: { characterId, amount, messageId } }) => {
      const character = selectCharacterById(store.getState(), characterId)
      if (!character) return
      const embeds = [
        new MessageEmbed({
          title: `${decoratedName(character)} gained ${EmojiValue(
            'xp',
            amount
          )} experience!`,
          description: `Total: ${EmojiValue('xp', character.xp)}`,
          color: 'YELLOW',
        }),
      ]
      sendEmbeds({ messageId, channel, embeds })
    },
  })
}
