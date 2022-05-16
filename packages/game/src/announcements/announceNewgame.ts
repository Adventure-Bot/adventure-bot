import { Client, MessageEmbed } from 'discord.js'

import store from '@adventure-bot/game/store'
import { newGame } from '@adventure-bot/game/store/actions'
import { startAppListening } from '@adventure-bot/game/store/listenerMiddleware'
import { selectLastChannelUsed } from '@adventure-bot/game/store/selectors'
import { asset } from '@adventure-bot/game/utils'

const getMainTextChannel = (client: Client) => {
  const state = store.getState()
  const lastChannelId = selectLastChannelUsed(state)
  const channel = client.channels.cache.get(lastChannelId)
  if (!channel?.isText()) return
  return channel
}

export const announceNewgame: (client: Client) => void = (client) => {
  startAppListening({
    actionCreator: newGame,
    effect: () => {
      const channel = getMainTextChannel(client)
      if (!channel) return
      channel.send({
        embeds: [
          new MessageEmbed({
            title: `🎉 Adventures Begin!`,
            color: 'GREEN',
            description:
              'A new game has started!\n\nUse `/adventure` to begin! Good luck, have fun!',
          }).setImage(asset('fantasy', 'magic', 'sparkle dust').s3Url),
        ],
      })
    },
  })
}
