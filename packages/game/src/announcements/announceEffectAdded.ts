import { Client } from 'discord.js'

import { decoratedName } from '@adventure-bot/game/character'
import { statusEffectEmbed } from '@adventure-bot/game/statusEffects'
import store from '@adventure-bot/game/store'
import { startAppListening } from '@adventure-bot/game/store/listenerMiddleware'
import {
  selectCharacterById,
  selectLastChannelUsed,
} from '@adventure-bot/game/store/selectors'
import { effectAdded } from '@adventure-bot/game/store/slices/characters'

export const announceEffectAdded: (client: Client) => void = (client) => {
  startAppListening({
    actionCreator: effectAdded,
    effect: ({ payload: { effect, characterId, image } }) => {
      const state = store.getState()
      const character = selectCharacterById(state, characterId)
      if (!character) return
      const lastChannelId = selectLastChannelUsed(state)
      const channel = client.channels.cache.get(lastChannelId)
      if (!channel?.isText()) return
      const embed = statusEffectEmbed(effect).setTitle(
        `${decoratedName(character)} ${effect.announcement}!`
      )
      if (image) embed.setImage(image)
      channel.send({
        embeds: [embed],
      })
    },
  })
}
