import { EmbedBuilder } from 'discord.js'

import { hpBarField } from '@adventure-bot/game/character'
import { getRoamingMonsters, monsterEmbed } from '@adventure-bot/game/monster'

export function roamingMonstersEmbeds(): EmbedBuilder[] {
  const roamingMonsters = getRoamingMonsters()
  if (roamingMonsters.length === 0)
    return [
      new EmbedBuilder({
        title: 'No monsters yet. /adventure to find some!',
      }),
    ]

  return [
    new EmbedBuilder({
      title: 'Roaming Monsters',
    }),
    ...roamingMonsters.map((monster) =>
      monsterEmbed(monster).addFields([hpBarField({ character: monster })])
    ),
  ]
}
