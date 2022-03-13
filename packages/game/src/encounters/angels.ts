import { MessageEmbed } from 'discord.js'

import { decoratedName, getUserCharacter } from '@adventure-bot/game/character'
import { questEmbed } from '@adventure-bot/game/quest'
import store from '@adventure-bot/game/store'
import { questGranted } from '@adventure-bot/game/store/slices/characters'
import { CommandHandlerOptions, asset } from '@adventure-bot/game/utils'

export async function angels({
  interaction,
  replyType = 'editReply',
}: CommandHandlerOptions): Promise<void> {
  store.dispatch(
    questGranted({
      characterId: interaction.user.id,
      questId: 'healer',
    })
  )
  const character = getUserCharacter(interaction.user)
  const angel = asset('fantasy', 'characters', 'angel')

  interaction[replyType]({
    files: [angel.attachment],
    embeds: [
      new MessageEmbed({
        title: `${decoratedName(character)} encountered an angel!`,
        color: 'WHITE',
        description:
          'An angel implores you to mend what is broken.\nA taste of their power in return is thier token.',
      }).setImage(angel.attachmentString),
    ].concat(questEmbed(character) ?? []),
  })
}
