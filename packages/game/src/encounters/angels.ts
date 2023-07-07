import { Colors, EmbedBuilder } from 'discord.js'

import {
  decoratedName,
  findOrCreateCharacter,
} from '@adventure-bot/game/character'
import { questEmbed } from '@adventure-bot/game/quest/questEmbed'
import store from '@adventure-bot/game/store'
import { questGranted } from '@adventure-bot/game/store/slices/characters'
import { CommandHandlerOptions, asset } from '@adventure-bot/game/utils'

export async function angels({
  interaction,
}: CommandHandlerOptions): Promise<void> {
  store.dispatch(
    questGranted({
      characterId: interaction.user.id,
      questId: 'healer',
    })
  )
  const character = findOrCreateCharacter(interaction.user)
  const quest = character.quests.healer

  interaction.channel?.send({
    embeds: [
      new EmbedBuilder({
        title: `${decoratedName(character)} encountered an angel!`,
        color: Colors.White,
        description:
          'An angel implores you to mend what is broken.\nA taste of their power in return is thier token.',
      }).setImage(asset('fantasy', 'characters', 'angel').s3Url),
    ].concat(quest ? questEmbed(quest) : []),
  })
}
