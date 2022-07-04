import { TextChannel } from 'discord.js'

import { sendEmbeds } from '@adventure-bot/game/announcements/sendEmbeds'
import { decoratedName } from '@adventure-bot/game/character'
import { statusEffectEmbed } from '@adventure-bot/game/statusEffects'
import { startAppListening } from '@adventure-bot/game/store/listenerMiddleware'
import { effectAdded } from '@adventure-bot/game/store/slices/statusEffects'

export function announceEffectAdded(channel: TextChannel): void {
  startAppListening({
    actionCreator: effectAdded,
    effect: ({ payload: { effect, character, image, messageId } }) => {
      const embed = statusEffectEmbed(effect).setTitle(
        `${decoratedName(character)} ${effect.announcement}`
      )
      if (image) embed.setImage(image)
      sendEmbeds({ messageId, channel, embeds: [embed] })
    },
  })
}
