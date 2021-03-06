import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction, TextChannel } from 'discord.js'
import { values } from 'remeda'

import {
  Character,
  characterEmbed,
  findOrCreateCharacter,
  statsEmbed,
} from '@adventure-bot/game/character'
import { cooldownsEmbed } from '@adventure-bot/game/commands/inspect/cooldownsEmbed'
import { getHook } from '@adventure-bot/game/commands/inspect/getHook'
import { itemEmbed } from '@adventure-bot/game/equipment'
import { questEmbed } from '@adventure-bot/game/quest'
import { statusEffectEmbed } from '@adventure-bot/game/statusEffects'
import store from '@adventure-bot/game/store'
import { selectCharacterById } from '@adventure-bot/game/store/selectors'
import { selectCharacterEffects } from '@adventure-bot/game/store/selectors'
import { CommandHandlerOptions } from '@adventure-bot/game/utils'

export const command = new SlashCommandBuilder()
  .setName('inspect')
  .setDescription('Inspect someone.')
  .addUserOption((option) =>
    option.setName('target').setDescription('Whom to inspect')
  )

export const execute = async ({
  interaction,
}: CommandHandlerOptions): Promise<void> => {
  const user =
    (interaction.options.data[0] && interaction.options.data[0].user) ||
    interaction.user
  findOrCreateCharacter(user) // ensure the character exists
  const character = selectCharacterById(store.getState(), user.id)
  if (!character) return

  await interaction.followUp({
    embeds: [
      characterEmbed({ character }),
      statsEmbed({ character, interaction }),
      cooldownsEmbed({ character, interaction }),
    ],
  })

  inspectThread({ interaction, character })
}

async function inspectThread({
  interaction,
  character,
}: {
  interaction: CommandInteraction
  character: Character
}): Promise<void> {
  const effectEmbeds = selectCharacterEffects(
    store.getState(),
    character.id
  ).map(statusEffectEmbed)
  const equipmentEmbeds = values(character.equipment)
    .map((item) => itemEmbed({ item, showEquipStatusFor: character }))
    .slice(0, 9)
  const somethingToShow =
    0 <
    (equipmentEmbeds.length ||
      effectEmbeds.length ||
      values(character.quests).length)
  if (!somethingToShow) return
  const channel = interaction.channel
  if (!(channel instanceof TextChannel)) return
  const thread = await channel.threads.create({
    name: `Inspect ${character.name}`,
  })
  if (equipmentEmbeds.length)
    await getHook({
      name: 'Equipment',
      channel,
    }).then((hook) => {
      hook?.send({
        embeds: equipmentEmbeds,
        threadId: thread.id,
      })
    })

  if (effectEmbeds.length > 0) {
    await getHook({
      name: 'Status Effects',
      channel,
    }).then((hook) =>
      hook?.send({
        embeds: effectEmbeds,
        threadId: thread.id,
      })
    )
  }
  const embed = questEmbed(character)
  if (embed) {
    await getHook({
      name: 'Quests',
      channel,
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
