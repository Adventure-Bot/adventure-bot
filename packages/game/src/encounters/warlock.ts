import { Colors, EmbedBuilder } from 'discord.js'

import {
  decoratedName,
  findOrCreateCharacter,
} from '@adventure-bot/game/character'
import { questEmbed } from '@adventure-bot/game/quest/questEmbed'
import store from '@adventure-bot/game/store'
import { questGranted } from '@adventure-bot/game/store/slices/characters'
import { CommandHandlerOptions, asset } from '@adventure-bot/game/utils'

export async function warlock({
  interaction,
}: CommandHandlerOptions): Promise<void> {
  store.dispatch(
    questGranted({
      characterId: interaction.user.id,
      questId: 'afflicted',
    })
  )

  const character = findOrCreateCharacter(interaction.user)
  const quest = character.quests.afflicted

  await interaction.channel?.send({
    embeds: [
      new EmbedBuilder({
        title: `${decoratedName(character)} encountered a warlock!`,
        color: Colors.DarkButNotBlack,
        description: 'The warlock offers a pact for suffering.',
      }).setImage(asset('fantasy', 'characters', 'tiefling warlock').s3Url),
    ].concat(quest ? questEmbed(quest) : []),
  })
}
