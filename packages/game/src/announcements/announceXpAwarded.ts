import { MessageEmbed, TextChannel } from 'discord.js'

import { EmojiValue } from '@adventure-bot/game/Emoji'
import { decoratedName } from '@adventure-bot/game/character'
import store from '@adventure-bot/game/store'
import { startAppListening } from '@adventure-bot/game/store/listenerMiddleware'
import { selectCharacterById } from '@adventure-bot/game/store/selectors'
import { xpAwarded } from '@adventure-bot/game/store/slices/characters'

export function announceXpAwarded({ channel }: { channel: TextChannel }): void {
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
      const message = messageId
        ? await channel.messages.fetch(messageId).catch(() => null)
        : null

      if (message) {
        message.reply({ embeds })
      } else {
        channel.send({ embeds })
      }
    },
  })
}
