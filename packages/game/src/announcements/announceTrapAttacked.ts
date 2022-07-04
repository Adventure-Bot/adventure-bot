import { MessageEmbed, TextChannel } from 'discord.js'

import { Emoji } from '@adventure-bot/game/Emoji'
import {
  decoratedName,
  getCharacter,
  hpBarField,
} from '@adventure-bot/game/character'
import { createEffect } from '@adventure-bot/game/statusEffects'
import store from '@adventure-bot/game/store'
import { trapAttacked } from '@adventure-bot/game/store/actions'
import { startAppListening } from '@adventure-bot/game/store/listenerMiddleware'
import { selectCharacterById } from '@adventure-bot/game/store/selectors'
import {
  damaged,
  questProgressed,
} from '@adventure-bot/game/store/slices/characters'
import { effectAdded } from '@adventure-bot/game/store/slices/statusEffects'
import { trapRollText } from '@adventure-bot/game/trap'

export function announceTrapAttacked(channel: TextChannel): void {
  startAppListening({
    actionCreator: trapAttacked,
    effect: async ({ payload }) => {
      const { messageId, result } = payload
      const {
        trap,
        defender: { id: characterId },
        outcome,
        damage,
      } = result
      const state = store.getState()
      const defender = selectCharacterById(state, characterId)
      if (!defender) return
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
      const message = messageId
        ? await channel.messages.fetch(messageId).catch(() => null)
        : null

      const embeds = [embed]
      if (message) {
        message.reply({ embeds })
      } else {
        channel.send({ embeds })
      }

      if ('hit' === outcome) {
        if (damage) {
          store.dispatch(
            damaged({
              character: defender,
              amount: damage,
            })
          )
          if (getCharacter(defender.id)?.hp ?? 0 > 0)
            store.dispatch(
              questProgressed({
                characterId,
                questId: 'survivor',
                amount: damage,
              })
            )
        }
        if (trap.onHitEffect)
          store.dispatch(
            effectAdded({
              characterId,
              effect: createEffect(trap.onHitEffect),
              messageId,
            })
          )
      }
    },
  })
}
