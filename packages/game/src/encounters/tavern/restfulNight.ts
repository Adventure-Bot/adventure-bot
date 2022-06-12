import { CommandInteraction, MessageEmbed } from 'discord.js'
import { clamp } from 'remeda'

import {
  decoratedName,
  findOrCreateCharacter,
  hpBarField,
} from '@adventure-bot/game/character'
import quests from '@adventure-bot/game/commands/quests'
import {
  isUserQuestComplete,
  questProgressField,
} from '@adventure-bot/game/quest'
import { createEffect } from '@adventure-bot/game/statusEffects'
import store from '@adventure-bot/game/store'
import {
  healed,
  questProgressed,
  xpAwarded,
} from '@adventure-bot/game/store/slices/characters'
import { effectAdded } from '@adventure-bot/game/store/slices/statusEffects'
import { asset, d6 } from '@adventure-bot/game/utils'

export async function restfulNight(
  interaction: CommandInteraction
): Promise<void> {
  const preHealCharacter = findOrCreateCharacter(interaction.user)
  const healAmount = d6()
  const { maxHP } = preHealCharacter.statsModified
  const { hp } = preHealCharacter
  const actualHeal = clamp(healAmount, {
    max: maxHP - hp,
  })

  const character = findOrCreateCharacter(interaction.user)
  await interaction.followUp({
    embeds: [
      new MessageEmbed({
        title: `${decoratedName(character)} had a restful night.`,
        color: 'DARK_NAVY',
        description: 'You feel well rested. 💤',
        fields: [
          hpBarField({
            character,
            adjustment: actualHeal,
          }),
        ].concat(
          character.quests.healer
            ? questProgressField(character.quests.healer)
            : []
        ),
      })
        .setImage(asset('fantasy', 'magic', 'sleep spell').s3Url)
        .setThumbnail(character.profile),
    ],
  })
  store.dispatch(healed({ character, amount: actualHeal }))

  store.dispatch(
    effectAdded({
      characterId: interaction.user.id,
      effect: createEffect('invigorated'),
    })
  )
  store.dispatch(
    questProgressed({
      characterId: interaction.user.id,
      questId: 'healer',
      amount: actualHeal,
    })
  )

  store.dispatch(xpAwarded({ characterId: interaction.user.id, amount: 1 }))

  if (isUserQuestComplete(interaction.user, 'healer'))
    await quests.execute({ interaction })
}
