import { CommandInteraction, MessageEmbed } from 'discord.js'

import {
  awardXP,
  decoratedName,
  findOrCreateCharacter,
  hpBarField,
} from '@adventure-bot/game/character'
import { updateQuestProgess } from '@adventure-bot/game/quest'
import store from '@adventure-bot/game/store'
import { damaged } from '@adventure-bot/game/store/slices/characters'
import { asset, d6 } from '@adventure-bot/game/utils'

export async function barFight(
  interaction: CommandInteraction,
  followUp = true
): Promise<void> {
  const damage = d6()
  const character = findOrCreateCharacter(interaction.user)
  store.dispatch(damaged({ character, amount: damage }))
  const embed = new MessageEmbed({
    title: `${decoratedName(character)} got into a bar fight!`,
    color: 'RED',
    description: 'You get into a drunken brawl and are kicked out.',
    fields: [
      hpBarField({
        character: findOrCreateCharacter(interaction.user),
        adjustment: -damage,
      }),
    ],
  })
    .setImage(asset('fantasy', 'places', 'drunken bar brawl in a tavern').s3Url)
    .setThumbnail(character.profile)
  if (damage < character.hp)
    updateQuestProgess({
      interaction,
      characterId: interaction.user.id,
      questId: 'survivor',
      amount: damage,
    })

  await interaction[followUp ? 'followUp' : 'reply']({
    embeds: [embed],
  })
  awardXP({ characterId: interaction.user.id, amount: 1 })
}
