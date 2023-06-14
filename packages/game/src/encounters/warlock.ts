import { MessageEmbed } from 'discord.js'

import {
  decoratedName,
  findOrCreateCharacter,
} from '@adventure-bot/game/character'
import { questEmbed } from '@adventure-bot/game/quest'
import store from '@adventure-bot/game/store'
import { questGranted } from '@adventure-bot/game/store/slices/characters'
import { CommandHandlerOptions, asset } from '@adventure-bot/game/utils'

export async function warlock({
  interaction,
  replyType = 'editReply',
}: CommandHandlerOptions): Promise<void> {
  store.dispatch(
    questGranted({
      characterId: interaction.user.id,
      questId: 'afflicted',
    })
  )

  const character = findOrCreateCharacter(interaction.user)

  await interaction[replyType]({
    embeds: [
      new MessageEmbed({
        title: `${decoratedName(character)} encountered a warlock!`,
        color: 'DARK_BUT_NOT_BLACK',
        description: 'The warlock offers a pact for suffering.',
      }).setImage(asset('fantasy', 'characters', 'tiefling warlock').s3Url),
    ].concat(questEmbed(character) ?? []),
  })
}
