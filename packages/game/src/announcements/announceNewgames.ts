import { Client, Colors, EmbedBuilder } from 'discord.js'

import { newgame } from '@adventure-bot/game/store/actions'
import { startAppListening } from '@adventure-bot/game/store/listenerMiddleware'
import { asset } from '@adventure-bot/game/utils'

import { getLastChannelUsed } from '../client/getLastChannelUsed'

export const announceNewgames: (client: Client) => void = (client) => {
  startAppListening({
    actionCreator: newgame,
    effect: () => {
      const channel = getLastChannelUsed(client)
      if (!channel) return
      channel.send({
        embeds: [
          new EmbedBuilder({
            title: `🎉 Adventures Begin!`,
            color: Colors.Green,
            description:
              'A new game has started!\n\nUse `/adventure` to begin! Good luck, have fun!',
          }).setImage(asset('fantasy', 'magic', 'sparkle dust').s3Url),
        ],
      })
    },
  })
}
