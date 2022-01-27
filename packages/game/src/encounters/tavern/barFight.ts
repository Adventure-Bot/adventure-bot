import { CommandInteraction, MessageEmbed } from 'discord.js'

import {
  getUserCharacter,
  hpBarField,
  xpGainField,
} from '@adventure-bot/game/character'
import {
  questProgressField,
  updateUserQuestProgess,
} from '@adventure-bot/game/quest'
import store from '@adventure-bot/game/store'
import { damaged, xpAwarded } from '@adventure-bot/game/store/slices/characters'
import { d6 } from '@adventure-bot/game/utils'

export async function barFight(
  interaction: CommandInteraction,
  followUp = true
): Promise<void> {
  const damage = d6()
  store.dispatch(xpAwarded({ characterId: interaction.user.id, amount: 1 }))
  store.dispatch(damaged({ characterId: interaction.user.id, amount: damage }))
  const embed = new MessageEmbed({
    title: 'Bar Fight!',
    color: 'RED',
    description: 'You get into a drunken brawl and are kicked out.',
    fields: [
      xpGainField(1),
      hpBarField({
        character: getUserCharacter(interaction.user),
        adjustment: -damage,
      }),
    ],
  }).setImage('https://i.imgur.com/yo1JymD.png')
  const character = getUserCharacter(interaction.user)
  if (character.hp > 0 && character.quests.survivor) {
    const updated = updateUserQuestProgess(interaction.user, 'survivor', damage)
    if (updated && updated.quests.survivor)
      embed.addFields([questProgressField(updated.quests.survivor)])
  }

  await interaction[followUp ? 'followUp' : 'reply']({
    embeds: [embed],
  })
}
