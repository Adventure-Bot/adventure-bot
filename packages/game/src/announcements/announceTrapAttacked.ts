import { Client, MessageEmbed } from 'discord.js'

import { Emoji } from '@adventure-bot/game/Emoji'
import {
  awardXP,
  decoratedName,
  getCharacter,
  hpBarField,
  xpGainField,
} from '@adventure-bot/game/character'
import { createEffect } from '@adventure-bot/game/statusEffects'
import store from '@adventure-bot/game/store'
import { trapAttacked } from '@adventure-bot/game/store/actions'
import { startAppListening } from '@adventure-bot/game/store/listenerMiddleware'
import {
  selectCharacterById,
  selectLastChannelUsed,
} from '@adventure-bot/game/store/selectors'
import {
  damaged,
  effectAdded,
  questProgressed,
} from '@adventure-bot/game/store/slices/characters'
import { trapRollText } from '@adventure-bot/game/trap'

export const announceTrapAttacked: (client: Client) => void = (client) => {
  startAppListening({
    actionCreator: trapAttacked,
    effect: ({ payload: result }) => {
      const { trap } = result
      const state = store.getState()
      const character = selectCharacterById(state, result.defender.id)
      if (!character) return
      const lastChannelId = selectLastChannelUsed(state)
      const channel = client.channels.cache.get(lastChannelId)
      if (!channel?.isText()) return

      const hitOrMissed = result.outcome === 'hit' ? 'hit' : 'missed'
      const embed = new MessageEmbed({
        title: `${Emoji(result.outcome)} ${decoratedName(
          character
        )} was ${hitOrMissed} by a ${trap.name}!`,
        color: 'RED',
        description: result.outcome === 'hit' ? trap.hitText : trap.missText,
      })
        .setImage(trap.image)
        .setThumbnail(character.profile)
      embed.addField('Trap Attack', trapRollText(result))
      switch (result.outcome) {
        case 'hit':
          awardXP(character.id, 1)
          embed.addFields([
            xpGainField(1),
            hpBarField({ character, adjustment: -result.damage }),
          ])
          break
        case 'miss':
          awardXP(character.id, 2)
          embed.addFields([xpGainField(2)])
          break
      }

      channel.send({
        embeds: [embed],
      })

      if ('hit' === result.outcome) {
        if (result.damage) {
          store.dispatch(
            damaged({
              characterId: character.id,
              amount: result.damage,
            })
          )
          if (getCharacter(character.id)?.hp ?? 0 > 0)
            store.dispatch(
              questProgressed({
                characterId: character.id,
                questId: 'survivor',
                amount: result.damage,
              })
            )
        }
        if (trap.onHitEffect)
          store.dispatch(
            effectAdded({
              characterId: character.id,
              effect: createEffect(trap.onHitEffect),
            })
          )
      }
    },
  })
}
