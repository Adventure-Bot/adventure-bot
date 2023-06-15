import { SlashCommandBuilder } from '@discordjs/builders'
import { MessageEmbed } from 'discord.js'

import { EmojiModifier } from '@adventure-bot/game/Emoji'
import {
  cooldownRemainingText,
  decoratedName,
  findOrCreateCharacter,
  hpBarField,
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

  const result = heal({ healerId: character.id, targetId: target.id })
  if (!result) {
    interaction.editReply('No result. This should not happen.')
    return
  }
  if (result.outcome === 'cooldown') {
    await cooldowns.execute({ interaction })
    return
  }
  updateQuestProgess(interaction, interaction.user.id, 'healer', result.amount)

  character = findOrCreateCharacter(interaction.user)

  const maybeTargetName =
    target.id === character.id ? '' : ' ' + decoratedName(target)

  await interaction.editReply({
    embeds: [
      new MessageEmbed({
        color: 'WHITE',
        title: `${decoratedName(
          character
        )} healed${maybeTargetName} for ${EmojiModifier(
          'heal',
          result.amount
        )}`,
        fields: [
          hpBarField({
            character: target,
            adjustment: result.amount,
          }),
        ],
      })
        .setImage(
          asset('fantasy', 'magic', 'a glowing hand applying healing magic')
            .s3Url
        )
        .setThumbnail(character.profile)
        .setDescription(
          `Can heal again ${cooldownRemainingText(character.id, 'heal')}`
        ),
    ].concat(),
  })
}

export default { command, execute }
