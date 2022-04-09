import { CommandInteraction, MessageEmbed, TextChannel } from 'discord.js'

import {
  decoratedName,
  findOrCreateCharacter,
  hpBarField,
} from '@adventure-bot/game/character'
import { getHook } from '@adventure-bot/game/commands/inspect/getHook'
import { monsterEmbed } from '@adventure-bot/game/monster'
import store from '@adventure-bot/game/store'
import { selectRoamingMonsters } from '@adventure-bot/game/store/selectors'

export async function listMonsters(
  interaction: CommandInteraction
): Promise<void> {
  const roamingMonsters = selectRoamingMonsters(store.getState())
  const character = findOrCreateCharacter(interaction.user)
  const channel = interaction.channel
  if (!(channel instanceof TextChannel)) return
  if (!roamingMonsters.length) {
    interaction.followUp({
      embeds: [
        new MessageEmbed({
          description:
            'No monsters encountered yet.\n\n`/adventure` to find some!',
        }),
      ],
    })
    return
  }
  interaction.followUp(`${decoratedName(character)} checks the wanted board.`)
  const thread = await channel.threads.create({
    name: 'Roaming Monsters',
  })
  await getHook({
    name: 'Roaming Monsters',
    channel,
  }).then((hook) => {
    if (!hook) return
    const embeds = roamingMonsters.map((monster) =>
      monsterEmbed(monster).addFields([hpBarField({ character: monster })])
    )
    embeds.forEach(
      async (embed) => await hook.send({ embeds: [embed], threadId: thread.id })
    )
    thread.setArchived(true)
  })
}
