import { CommandInteraction, MessageEmbed } from 'discord.js'
import { clamp } from 'remeda'

import { getCharacterStatModified } from '@adventure-bot/character'
import { getUserCharacter } from '@adventure-bot/character'
import { hpBarField } from '@adventure-bot/character'
import { xpGainField } from '@adventure-bot/character'
import quests from '@adventure-bot/commands/quests'
import { isUserQuestComplete } from '@adventure-bot/quest/isQuestComplete'
import { questProgressField } from '@adventure-bot/quest/questProgressField'
import { createEffect } from '@adventure-bot/statusEffects'
import { statusEffectEmbed } from '@adventure-bot/statusEffects/statusEffectEmbed'
import store from '@adventure-bot/store'
import {
  effectAdded,
  healed,
  questProgressed,
  xpAwarded,
} from '@adventure-bot/store/slices/characters'
import { d6 } from '@adventure-bot/utils/dice'

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
        title: 'Restful Night',
        color: 'DARK_NAVY',
        description: 'You feel well rested. 💤',
        fields: [
          hpBarField({
            character: getUserCharacter(interaction.user),
            adjustment: actualHeal,
          }),
          xpGainField(interaction, 1),
        ].concat(
          character.quests.healer
            ? questProgressField(character.quests.healer)
            : []
        ),
      }).setImage('https://i.imgur.com/5FAD82X.png'),
      statusEffectEmbed(effect, interaction),
    ],
  })

  if (isUserQuestComplete(interaction.user, 'healer'))
    await quests.execute(interaction)
}
