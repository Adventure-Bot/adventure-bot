import { MessageEmbed, TextChannel } from 'discord.js'

import { Emoji, EmojiModifier, d20Emoji } from '@adventure-bot/game/Emoji'
import { decoratedName, statContested } from '@adventure-bot/game/character'
import store from '@adventure-bot/game/store'
import { startAppListening } from '@adventure-bot/game/store/listenerMiddleware'
import { selectCharacterById } from '@adventure-bot/game/store/selectors'

export function announceStatContested({
  channel,
}: {
  channel: TextChannel
}): void {
  startAppListening({
    actionCreator: statContested,
    effect: async ({
      payload: {
        characterId,
        check,
        difficulty,
        modifier,
        stat,
        success,
        messageId,
        failureText,
        successText,
        secret,
      },
    }) => {
      const character = selectCharacterById(store.getState(), characterId)
      if (!character) return
      const fields = []
      if (!secret) {
        fields.push({
          name: 'Difficulty',
          value: Emoji(stat) + difficulty,
        })
      }
      fields.push({
        name: 'Stat Modifier',
        value: EmojiModifier(stat, modifier),
      })
      if (!secret) {
        fields.push({
          name: 'Roll Needed',
          value: Emoji(stat) + d20Emoji(difficulty - modifier),
        })
      }

      const embed = new MessageEmbed({
        title: `${decoratedName(character)} ${
          success ? successText : failureText
        }`,
        fields,
        color: success ? 'GREEN' : 'RED',
      }).setThumbnail(character.profile)
      const embeds = [embed]

      const messagePayload = {
        embeds,
        content: Emoji(stat) + d20Emoji(check),
      }
      const message = messageId ? await channel.messages.fetch(messageId) : null

      if (message) {
        message.reply(messagePayload)
      } else {
        channel.send(messagePayload)
      }
    },
  })
}
