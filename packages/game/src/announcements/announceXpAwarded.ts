import { Colors, EmbedBuilder, TextChannel } from 'discord.js'

import { EmojiValue } from '@adventure-bot/game/Emoji'
import store from '@adventure-bot/game/store'
import { startAppListening } from '@adventure-bot/game/store/listenerMiddleware'
import { selectCharacterById } from '@adventure-bot/game/store/selectors'
import { xpAwarded } from '@adventure-bot/game/store/slices/characters'

import { sendEmbeds } from './sendEmbeds'

export function announceXpAwarded(channel: TextChannel): void {
  startAppListening({
    actionCreator: xpAwarded,
    effect: async ({ payload: { characterId, amount } }) => {
      const character = selectCharacterById(store.getState(), characterId)
      if (!character) return
      const embeds = [
        new EmbedBuilder({
          title: `${character.name} gained ${amount} experience!`,
          description: EmojiValue('xp', character.xp),
          color: Colors.Yellow,
        }),
      ]
      sendEmbeds({ channel, embeds })
    },
  })
}
