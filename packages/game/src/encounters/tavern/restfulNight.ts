import { CommandInteraction, MessageEmbed } from 'discord.js'

import {
  decoratedName,
  findOrCreateCharacter,
  hpBarField,
} from '@adventure-bot/game/character'
import quests from '@adventure-bot/game/commands/quests'
import {
  isUserQuestComplete,
  questProgressField,
  updateQuestProgess,
} from '@adventure-bot/game/quest'
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
      character: findOrCreateCharacter(interaction.user),
      effect: createEffect('invigorated'),
    })
  )
  const character = findOrCreateCharacter(interaction.user)
  const amountHealed = character.statsModified.maxHP - startingHitpoints
  // heal to full
  if (amountHealed > 0) {
    store.dispatch(
      healed({
        character,
        amount: amountHealed,
      })
    )
  }

  const { id: messageId } = await interaction.followUp({
    embeds: [
      new MessageEmbed({
        title: `${decoratedName(character)} had a restful night.`,
        color: 'DARK_NAVY',
        description: 'You feel well rested. 💤',
        fields: [
          hpBarField({
            character,
            adjustment: amountHealed,
          }),
        ].concat(
          character.quests.healer
            ? questProgressField(character.quests.healer)
            : []
        ),
      })
        .setImage(asset('fantasy', 'places', 'restful tavern').s3Url)
        .setThumbnail(character.profile),
    ],
  })

  updateQuestProgess(interaction.user.id, 'healer', amountHealed)

  store.dispatch(
    xpAwarded({
      characterId: interaction.user.id,
      amount: 1,
      messageId,
    })
  )

  if (isUserQuestComplete(interaction.user, 'healer'))
    await quests.execute({ interaction })
}
