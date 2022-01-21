import { CommandInteraction, MessageEmbed } from 'discord.js'
import { getCharacter } from '@adventure-bot/character/getCharacter'
import { getMonster } from '@adventure-bot/monster/getMonster'
import { decoratedName } from '@adventure-bot/character/decoratedName'
import { Encounter } from '@adventure-bot/encounter/Encounter'

export const encounterEmbed = ({
  encounter,
}: {
  encounter: Encounter
  interaction: CommandInteraction
}): MessageEmbed => {
  const character = getCharacter(encounter.characterId)
  const monster = getMonster(encounter.monsterId)

  if (!character)
    return new MessageEmbed({
      title: `Character ${encounter.characterId} not found`,
    })
  if (!monster)
    return new MessageEmbed({
      title: `Monster ${encounter.monsterId} not found`,
    })
  const embed = new MessageEmbed({
    title: `${decoratedName(character)} vs ${decoratedName(monster)}`,
    fields: [
      {
        name: 'Outcome',
        value: encounter.outcome,
        inline: true,
      },
      {
        name: 'Rounds',
        value: encounter.rounds.toString(),
        inline: true,
      },
    ],
    timestamp: encounter.date,
  })
    .setColor('RED')
    .setImage(monster.profile)
    .setThumbnail(character.profile)
  return embed
}
