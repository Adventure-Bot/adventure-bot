import { Colors, EmbedBuilder } from 'discord.js'

import { decoratedName, getCharacter } from '@adventure-bot/game/character'
import { getMonster } from '@adventure-bot/game/monster'
import store from '@adventure-bot/game/store'
import { selectEncounterById } from '@adventure-bot/game/store/selectors'

export const encounterEmbed = ({
  encounterId,
}: {
  encounterId: string
}): EmbedBuilder => {
  const encounter = selectEncounterById(store.getState(), encounterId)

  const character = getCharacter(encounter.characterId)
  const monster = getMonster(encounter.monsterId)

  if (!character)
    return new EmbedBuilder({
      title: `Character ${encounter.characterId} not found`,
    })
  if (!monster)
    return new EmbedBuilder({
      title: `Monster ${encounter.monsterId} not found`,
    })
  const embed = new EmbedBuilder({
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
    .setColor(Colors.Red)
    .setImage(monster.profile)
    .setThumbnail(character.profile)
  return embed
}
