import { CommandInteraction, MessageEmbed } from 'discord.js'
import { getCharacter } from '../../character/getCharacter'
import { getMonster } from '../../monster/getMonster'
import { decoratedName } from '../../character/decoratedName'
import { Encounter } from '../../encounter/Encounter'

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
