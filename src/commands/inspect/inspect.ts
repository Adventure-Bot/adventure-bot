import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction, TextChannel } from 'discord.js'
import { values } from 'remeda'

import { Character } from '@adventure-bot/character'
import {
  characterEmbed,
  getUserCharacter,
  statsEmbed,
} from '@adventure-bot/character'
import { actionEmbed } from '@adventure-bot/commands/inspect/actionEmbed'
import { getHook } from '@adventure-bot/commands/inspect/getHook'
import { itemEmbed } from '@adventure-bot/equipment'
import { questEmbed } from '@adventure-bot/quest'
import { statusEffectEmbed } from '@adventure-bot/statusEffects/statusEffectEmbed'

export const command = new SlashCommandBuilder()
  .setName('inspect')
  .setDescription('Inspect someone.')
  .addUserOption((option) =>
    option.setName('target').setDescription('Whom to inspect')
  )

// TODO: inspect hp|stats|inventory|cooldowns
export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const user =
    (interaction.options.data[0] && interaction.options.data[0].user) ||
    interaction.user
  const character = getUserCharacter(user)
  console.log(`inspect ${character.name}`, character)

  await interaction.followUp({
    embeds: [
      characterEmbed({ character, interaction }),
      statsEmbed({ character, interaction }),
      actionEmbed({ character, interaction }),
    ],
  })

  if (
    values(character.equipment).length ||
    (character.statusEffects?.length ?? 0) ||
    values(character.quests).length
  )
    inspectThread({ interaction, character })
}

async function inspectThread({
  interaction,
  character,
}: {
  interaction: CommandInteraction
  character: Character
}): Promise<void> {
  const channel = interaction.channel
  if (!(channel instanceof TextChannel)) return
  const thread = await channel.threads.create({
    name: `Inspect ${character.name}`,
  })
  const webhooks = await channel.fetchWebhooks()
  const equipmentEmbeds = values(character.equipment)
    .map((item) => itemEmbed({ item, interaction }))
    .slice(0, 9)
  if (equipmentEmbeds.length)
    await getHook({
      name: 'Equipment',
      webhooks,
      interaction,
    }).then((hook) => {
      hook?.send({
        embeds: equipmentEmbeds,
        threadId: thread.id,
      })
    })

  if ((character.statusEffects?.length ?? 0) > 0) {
    await getHook({
      name: 'Status Effects',
      webhooks,
      interaction,
    }).then((hook) =>
      hook?.send({
        embeds: character.statusEffects?.map((effect) =>
          statusEffectEmbed(effect, interaction)
        ),
        threadId: thread.id,
      })
    )
  }
  const embed = questEmbed(character)
  if (embed) {
    await getHook({
      name: 'Quests',
      webhooks,
      interaction,
    }).then((hook) =>
      hook?.send({
        embeds: [embed],
        threadId: thread.id,
      })
    )
  }
  thread.setArchived(true)
}

export default { command, execute }
