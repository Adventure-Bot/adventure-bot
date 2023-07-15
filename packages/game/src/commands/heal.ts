import { Colors, EmbedBuilder, SlashCommandBuilder } from 'discord.js'

import {
  cooldownRemainingText,
  decoratedName,
  findOrCreateCharacter,
} from '@adventure-bot/game/character'
import cooldowns from '@adventure-bot/game/commands/cooldowns'
import { heal } from '@adventure-bot/game/heal/heal'
import { updateQuestProgess } from '@adventure-bot/game/quest'
import { CommandHandlerOptions, asset } from '@adventure-bot/game/utils'

export const command = new SlashCommandBuilder()
  .setName('heal')
  .setDescription('Heal someone')
  .addUserOption((option) =>
    option.setName('target').setDescription('Whom to heal')
  )

export const execute = async ({
  interaction,
}: CommandHandlerOptions): Promise<void> => {
  const target = findOrCreateCharacter(
    (interaction.options.data[0] && interaction.options.data[0].user) ||
      interaction.user
  )

  let character = findOrCreateCharacter(interaction.user)

  const result = heal({
    healerId: character.id,
    targetId: target.id,
    interaction,
  })
  if (!result) return
  if (result.outcome === 'cooldown') {
    await cooldowns.execute({ interaction })
    return
  }

  const maybeOnTarget =
    target.id === character.id ? '' : ' on ' + decoratedName(target)
  await interaction.channel?.send({
    embeds: [
      new EmbedBuilder({
        color: Colors.White,
        title: `${decoratedName(character)} used Heal${maybeOnTarget}`,
        description: `Can heal again ${cooldownRemainingText(
          character.id,
          'heal'
        )}`,
      })
        .setImage(
          asset('fantasy', 'magic', 'a glowing hand applying healing magic')
            .s3Url
        )
        .setThumbnail(character.profile),
    ].concat(),
  })

  updateQuestProgess({
    interaction,
    characterId: interaction.user.id,
    questId: 'healer',
    amount: result.amount,
  })

  character = findOrCreateCharacter(interaction.user)
}

export default { command, execute }
