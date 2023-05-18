import { MessageEmbed, TextChannel } from 'discord.js'

import { EmojiValue } from '@adventure-bot/game/Emoji'
import store from '@adventure-bot/game/store'
import { startAppListening } from '@adventure-bot/game/store/listenerMiddleware'
import { selectCharacterById } from '@adventure-bot/game/store/selectors'
import { goldStolen } from '@adventure-bot/game/store/slices/characters'

import { sendEmbeds } from './sendEmbeds'

export function announceGoldStolen(channel: TextChannel): void {
  startAppListening({
    actionCreator: goldStolen,
    effect: async ({ payload: { attackerId, defenderId, amount } }) => {
      const attacker = selectCharacterById(store.getState(), attackerId)
      const defender = selectCharacterById(store.getState(), defenderId)
      if (!attacker || !defender) return
      if (amount === 0) return
      const embeds = [
        new MessageEmbed({
          title: `${attacker.name} robbed ${defender.name} of ${EmojiValue(
            'gold',
            amount
          )} gold!`,
          color: 'YELLOW',
        }),
      ]
      sendEmbeds({ channel, embeds })
    },
  })
}
