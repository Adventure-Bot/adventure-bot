import { Colors, EmbedBuilder, TextChannel } from 'discord.js'

import { sendEmbeds } from '@adventure-bot/game/announcements/sendEmbeds'
import { startAppListening } from '@adventure-bot/game/store/listenerMiddleware'
import { effectRemoved } from '@adventure-bot/game/store/slices/statusEffects'

export function announceEffectRemoved(channel: TextChannel): void {
  startAppListening({
    actionCreator: effectRemoved,
    effect: ({ payload: { effect, character, image } }) => {
      const embed = new EmbedBuilder({
        title: `${character.name} is no longer ${effect.name} ✨`,
        color: Colors.White,
      })
      if (image) embed.setImage(image)
      sendEmbeds({
        channel,
        embeds: [embed],
      })
    },
  })
}
