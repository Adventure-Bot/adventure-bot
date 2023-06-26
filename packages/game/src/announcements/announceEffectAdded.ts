import { TextChannel } from 'discord.js'

import { sendEmbeds } from '@adventure-bot/game/announcements/sendEmbeds'
import { statusEffectEmbed } from '@adventure-bot/game/statusEffects'
import { startAppListening } from '@adventure-bot/game/store/listenerMiddleware'
import { effectAdded } from '@adventure-bot/game/store/slices/statusEffects'

export function announceEffectAdded(channel: TextChannel): void {
  startAppListening({
    actionCreator: effectAdded,
    effect: ({ payload: { effect, character, image } }) => {
      const embed = statusEffectEmbed(effect).setTitle(
        `${character.name} ${effect.announcement}`
      )
      if (image) embed.setImage(image)
      sendEmbeds({ channel, embeds: [embed] })
    },
  })
}
