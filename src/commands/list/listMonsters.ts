import { CommandInteraction, MessageEmbed } from 'discord.js'

import { hpBarField } from '@adventure-bot/character/hpBar/hpBarField'
import { monsterEmbed } from '@adventure-bot/encounters/utils/monsterEmbed'
import { getRoamingMonsters } from '@adventure-bot/monster/getRoamingMonsters'

export function listMonsters(interaction: CommandInteraction): void {
  const monsters = getRoamingMonsters()
  interaction.editReply({
    embeds: [
      new MessageEmbed({ title: 'Monsters at large' }),
      ...(monsters.length > 0
        ? monsters
            .slice(0, 10)
            .map((monster) =>
              monsterEmbed(monster).addFields([
                hpBarField({ character: monster }),
              ])
            )
        : [
            new MessageEmbed({
              description:
                'No monsters encountered yet. `/adventure` to find some!',
            }),
          ]),
    ],
  })
}
