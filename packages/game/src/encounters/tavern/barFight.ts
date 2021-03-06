import { CommandInteraction, MessageEmbed } from 'discord.js'

import {
  decoratedName,
  findOrCreateCharacter,
  hpBarField,
} from '@adventure-bot/game/character'
import {
  questProgressField,
  updateUserQuestProgess,
} from '@adventure-bot/game/quest'
import store from '@adventure-bot/game/store'
import { damaged, xpAwarded } from '@adventure-bot/game/store/slices/characters'
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
  if (character.hp > 0 && character.quests.survivor) {
    const updated = updateUserQuestProgess(interaction.user, 'survivor', damage)
    if (updated && updated.quests.survivor)
      embed.addFields([questProgressField(updated.quests.survivor)])
  }

  await interaction[followUp ? 'followUp' : 'reply']({
    embeds: [embed],
  })
  store.dispatch(xpAwarded({ characterId: interaction.user.id, amount: 1 }))
}
