import { Colors, CommandInteraction, EmbedBuilder } from 'discord.js'

import {
  decoratedName,
  findOrCreateCharacter,
} from '@adventure-bot/game/character'
import { updateQuestProgess } from '@adventure-bot/game/quest'
import { createEffect } from '@adventure-bot/game/statusEffects'
import store from '@adventure-bot/game/store'
import { healed, xpAwarded } from '@adventure-bot/game/store/slices/characters'
import { effectAdded } from '@adventure-bot/game/store/slices/statusEffects'
import { asset } from '@adventure-bot/game/utils'

export async function restfulNight(
  interaction: CommandInteraction
): Promise<void> {
  const startingHitpoints = findOrCreateCharacter(interaction.user).hp
  store.dispatch(
    effectAdded({
      interaction,
      character: findOrCreateCharacter(interaction.user),
      effect: createEffect('invigorated'),
    })
  )
  const character = findOrCreateCharacter(interaction.user)

  await interaction.followUp({
    embeds: [
      new EmbedBuilder({
        title: `${decoratedName(character)} had a restful night.`,
        color: Colors.DarkNavy,
        description: 'You feel well rested. 💤',
      })
        .setImage(asset('fantasy', 'places', 'restful tavern').s3Url)
        .setThumbnail(character.profile),
    ],
  })

  const missingHealth = character.statsModified.maxHP - startingHitpoints
  // heal to full
  if (missingHealth > 0) {
    store.dispatch(
      healed({
        character,
        amount: missingHealth,
      })
    )
  }

  updateQuestProgess({
    interaction,
    characterId: interaction.user.id,
    questId: 'healer',
    amount: missingHealth,
  })

  store.dispatch(
    xpAwarded({
      characterId: interaction.user.id,
      amount: 1,
    })
  )
}
