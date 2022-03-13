import { CommandInteraction, MessageEmbed } from 'discord.js'
import { clamp } from 'remeda'

import {
  decoratedName,
  getCharacterStatModified,
  getUserCharacter,
  hpBarField,
  xpGainField,
} from '@adventure-bot/game/character'
import quests from '@adventure-bot/game/commands/quests'
import {
  isUserQuestComplete,
  questProgressField,
} from '@adventure-bot/game/quest'
import { createEffect } from '@adventure-bot/game/statusEffects'
import { statusEffectEmbed } from '@adventure-bot/game/statusEffects'
import store from '@adventure-bot/game/store'
import {
  effectAdded,
  healed,
  questProgressed,
  xpAwarded,
} from '@adventure-bot/game/store/slices/characters'
import { asset, d6 } from '@adventure-bot/game/utils'

export async function restfulNight(
  interaction: CommandInteraction
): Promise<void> {
  const preHealCharacter = getUserCharacter(interaction.user)
  const healAmount = d6()
  const actualHeal = clamp(healAmount, {
    max:
      getCharacterStatModified(preHealCharacter, 'maxHP') - preHealCharacter.hp,
  })
  store.dispatch(xpAwarded({ characterId: interaction.user.id, amount: 1 }))
  store.dispatch(
    healed({ characterId: interaction.user.id, amount: actualHeal })
  )

  const effect = createEffect('invigorated')

  store.dispatch(
    effectAdded({
      characterId: interaction.user.id,
      effect,
    })
  )
  store.dispatch(
    questProgressed({
      characterId: interaction.user.id,
      questId: 'healer',
      amount: actualHeal,
    })
  )

  const character = getUserCharacter(interaction.user)
  await interaction.followUp({
    embeds: [
      new MessageEmbed({
        title: `${decoratedName(character)} had a restful night.`,
        color: 'DARK_NAVY',
        description: 'You feel well rested. 💤',
        fields: [
          hpBarField({
            character: getUserCharacter(interaction.user),
            adjustment: actualHeal,
          }),
          xpGainField(1),
        ].concat(
          character.quests.healer
            ? questProgressField(character.quests.healer)
            : []
        ),
      })
        .setImage(asset('fantasy', 'magic', 'sleep spell').s3Url)
        .setThumbnail(character.profile),
      statusEffectEmbed(effect),
    ],
  })

  if (isUserQuestComplete(interaction.user, 'healer'))
    await quests.execute({ interaction })
}
