import { MessageEmbed, TextChannel } from 'discord.js'

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
      const hitOrMissed = outcome === 'hit' ? 'hit' : 'missed'
      const embed = new MessageEmbed({
        title: `${Emoji(outcome)} ${decoratedName(
          defender
        )} was ${hitOrMissed} by a ${trap.name}!`,
        color: 'RED',
        description: outcome === 'hit' ? trap.hitText : trap.missText,
      })
        .setImage(trap.image)
        .setThumbnail(defender.profile)
      embed.addField('Trap Attack', trapRollText(result))
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
