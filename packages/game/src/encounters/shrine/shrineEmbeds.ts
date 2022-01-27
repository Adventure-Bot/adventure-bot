import { CommandInteraction, MessageEmbed } from 'discord.js'

import { getUserCharacter } from '@adventure-bot/character'
import { Shrine } from '@adventure-bot/encounters/shrine'
import { questProgressField } from '@adventure-bot/quest'
import { statusEffectEmbed } from '@adventure-bot/statusEffects'

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
    statusEffectEmbed(shrine.effect),
  ]
}
