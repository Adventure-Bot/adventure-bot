import { CommandInteraction, TextChannel } from 'discord.js'

import {
  getUserCharacter,
  getUserCharacters,
  limitedCharacterEmbed,
} from '@adventure-bot/game/character'
import { getHook } from '@adventure-bot/game/commands/inspect/getHook'

export async function listCharacters(
  interaction: CommandInteraction
): Promise<void> {
  const character = getUserCharacter(interaction.user) // ensure Character existence to prevent an empty list
  const channel = interaction.channel
  if (!(channel instanceof TextChannel)) return
  const thread = await channel.threads.create({
    name: `Character list for ${interaction.user.username}`,
  })
  const embeds = getUserCharacters()
    .filter((character) => character.xp > 0)
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 10)
    .map((character) => limitedCharacterEmbed({ character, interaction }))
  const webhooks = await channel.fetchWebhooks()
  interaction.editReply(`${character.name} sized up the competition.`)
  await getHook({
    name: 'Characters',
    webhooks,
    interaction,
  }).then((hook) => {
    hook?.send({
      embeds,
      threadId: thread.id,
    })
  })
  thread.setArchived(true)
}
