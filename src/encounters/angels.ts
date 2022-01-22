import { CommandInteraction, MessageEmbed } from 'discord.js'

import { getUserCharacter } from '@adventure-bot/character'
import { questEmbed } from '@adventure-bot/quest'
import store from '@adventure-bot/store'
import { questGranted } from '@adventure-bot/store/slices/characters'
import { asset } from '@adventure-bot/utils'

export const angels = async (
  interaction: CommandInteraction
): Promise<void> => {
  store.dispatch(
    questGranted({
      characterId: interaction.user.id,
      questId: 'healer',
    })
  )
  const character = getUserCharacter(interaction.user)
  const angel = asset('fantasy', 'characters', 'angel')

  interaction.followUp({
    files: [angel.attachment],
    embeds: [
      new MessageEmbed({
        title: 'Angels',
        color: 'WHITE',
        description:
          'An angel implores you to mend what is broken.\nA taste of their power in return is thier token.',
      }).setImage(angel.attachmentString),
    ].concat(questEmbed(character) ?? []),
  })
}
