import { MessageEmbed } from 'discord.js'
import { pipe, sort, take } from 'remeda'

import { hpBarField } from '@adventure-bot/game/character'
import { getRoamingMonsters, monsterEmbed } from '@adventure-bot/game/monster'

export function roamingMonstersEmbeds(): MessageEmbed[] {
  const roamingMonsters = pipe(
    getRoamingMonsters(),
    sort((a, b) => a.gold - b.gold),
    take(9)
  )

  if (roamingMonsters.length === 0)
    return [
      new MessageEmbed({
        title: 'No monsters yet. /adventure to find some!',
      }),
    ]

  return [
    new MessageEmbed({
      title: 'Roaming Monsters',
    }),
    ...roamingMonsters.map((monster) =>
      monsterEmbed(monster).addFields([hpBarField({ character: monster })])
    ),
  ]
}
