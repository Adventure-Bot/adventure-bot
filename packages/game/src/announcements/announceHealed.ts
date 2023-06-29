import { Colors, EmbedBuilder, TextChannel } from 'discord.js'

import { hpBarField } from '@adventure-bot/game/character'
import { startAppListening } from '@adventure-bot/game/store/listenerMiddleware'
import { healed } from '@adventure-bot/game/store/slices/characters'
import { randomArrayElement } from '@adventure-bot/game/utils'

import { sendEmbeds } from './sendEmbeds'

export function announceHealed(channel: TextChannel): void {
  startAppListening({
    actionCreator: healed,
    effect: async ({ payload: { amount, character } }) => {
      const missingHealth = character.statsModified.maxHP - character.hp
      const adjustment = Math.min(amount, missingHealth)
      const verbed = randomArrayElement([
        'recovered',
        'healed',
        'restored',
        'regained',
        'replenished',
        'rejuvenated',
      ])
      if (!adjustment) return
      const embeds = [
        new EmbedBuilder({
          title: `${character.name} ${verbed} ${amount} health!`,
          fields: [hpBarField({ character, adjustment })],
          color: Colors.White,
        }),
      ]
      await sendEmbeds({ channel, embeds })
    },
  })
}
