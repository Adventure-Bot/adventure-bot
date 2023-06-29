import { Colors, EmbedBuilder, TextChannel } from 'discord.js'

import { Emoji, EmojiModifier, d20Emoji } from '@adventure-bot/game/Emoji'
import { decoratedName, statContested } from '@adventure-bot/game/character'
import { startAppListening } from '@adventure-bot/game/store/listenerMiddleware'

export function announceStatContested(channel: TextChannel): void {
  startAppListening({
    actionCreator: statContested,
    effect: async ({
      payload: {
        character,
        check,
        difficulty,
        modifier,
        stat,
        success,
        failureText,
        successText,
        secret,
      },
    }) => {
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

      const embed = new EmbedBuilder({
        title: `${decoratedName(character)} ${
          success ? successText : failureText
        }`,
        fields,
        color: success ? Colors.Green : Colors.Red,
      }).setThumbnail(character.profile)
      const embeds = [embed]

      const messagePayload = {
        embeds,
        content: Emoji(stat) + d20Emoji(check),
      }
      channel.send(messagePayload)
    },
  })
}
