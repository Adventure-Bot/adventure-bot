import { CommandInteraction, MessageEmbed, TextChannel } from 'discord.js'

import {
  decoratedName,
  getUserCharacter,
  hpBarField,
} from '@adventure-bot/character'
import { getHook } from '@adventure-bot/commands/inspect/getHook'
import { monsterEmbed } from '@adventure-bot/encounters'
import store from '@adventure-bot/store'
import { selectRoamingMonsters } from '@adventure-bot/store/selectors'

export async function listMonsters(
  interaction: CommandInteraction
): Promise<void> {
  const roamingMonsters = selectRoamingMonsters(store.getState())
  const character = getUserCharacter(interaction.user)
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
  const webhooks = await channel.fetchWebhooks()
  await getHook({
    name: 'Roaming Monsters',
    webhooks,
    interaction,
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
