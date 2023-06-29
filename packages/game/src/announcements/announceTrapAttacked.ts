import { Colors, EmbedBuilder, TextChannel } from 'discord.js'

import { Emoji } from '@adventure-bot/game/Emoji'
import { sendEmbeds } from '@adventure-bot/game/announcements/sendEmbeds'
import { decoratedName, hpBarField } from '@adventure-bot/game/character'
import { trapAttacked } from '@adventure-bot/game/store/actions'
import { startAppListening } from '@adventure-bot/game/store/listenerMiddleware'
import { trapRollText } from '@adventure-bot/game/trap'

export function announceTrapAttacked(channel: TextChannel): void {
  startAppListening({
    actionCreator: trapAttacked,
    effect: ({ payload }) => {
      const { messageId, result } = payload
      const { trap, defender, outcome, damage } = result
      const embed = new EmbedBuilder({
        title: `${Emoji(outcome)} ${decoratedName(defender)} was ${
          outcome === 'hit' ? 'hit' : 'missed'
        } by a ${trap.name}!`,
        color: outcome === 'hit' ? Colors.Red : Colors.Green,
        description: outcome === 'hit' ? trap.hitText : trap.missText,
      })
      embed.addFields([{ name: 'Trap Attack', value: trapRollText(result) }])
      if ('hit' === outcome) {
        embed.addFields([
          hpBarField({ character: defender, adjustment: -damage }),
        ])
      }
      sendEmbeds({
        channel,
        messageId,
        embeds: [embed],
      })
    },
  })
}
