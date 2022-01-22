import { CommandInteraction, MessageEmbed } from 'discord.js'

import { getUserCharacter } from '@adventure-bot/character'
import { questProgressField } from '@adventure-bot/quest/questProgressField'
import { Shrine } from '@adventure-bot/shrines/Shrine'
import { statusEffectEmbed } from '@adventure-bot/statusEffects/statusEffectEmbed'

export function shrineEmbeds({
  shrine,
  interaction,
}: {
  shrine: Shrine
  interaction: CommandInteraction
}): MessageEmbed[] {
  const character = getUserCharacter(interaction.user)
  const quest = character.quests.blessed
  return [
    new MessageEmbed({
      title: `${character.name} encounters a ${shrine.name}`,
      description: shrine.description,
      fields: quest ? [questProgressField(quest)] : [],
      color: shrine.color,
    }).setImage(shrine.image),
    statusEffectEmbed(shrine.effect, interaction),
  ]
}
