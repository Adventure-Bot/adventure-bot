import { SlashCommandBuilder } from '@discordjs/builders'
import { MessageEmbed } from 'discord.js'

import { EmojiModifier } from '@adventure-bot/game/Emoji'
import {
  decoratedName,
  getUserCharacter,
  hpBarField,
} from '@adventure-bot/game/character'
import cooldowns from '@adventure-bot/game/commands/cooldowns'
import quests from '@adventure-bot/game/commands/quests'
import { heal } from '@adventure-bot/game/heal/heal'
import {
  isUserQuestComplete,
  questProgressField,
  updateUserQuestProgess,
} from '@adventure-bot/game/quest'
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
  const target = getUserCharacter(
    (interaction.options.data[0] && interaction.options.data[0].user) ||
      interaction.user
  )

  let character = getUserCharacter(interaction.user)

  const result = heal({ healerId: character.id, targetId: target.id })
  if (!result) {
    interaction.editReply('No result. This should not happen.')
    return
  }
  if (result.outcome === 'cooldown') {
    await cooldowns.execute({ interaction })
    return
  }
  updateUserQuestProgess(interaction.user, 'healer', result.amount)

  character = getUserCharacter(interaction.user)

  const maybeTargetName =
    target.id === character.id ? '' : ' ' + decoratedName(target)

  await interaction.editReply({
    embeds: [
      new MessageEmbed({
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
        ].concat(
          character.quests.healer
            ? questProgressField(character.quests.healer)
            : []
        ),
      }).setImage(
        asset('fantasy', 'magic', 'a glowing hand applying healing magic').s3Url
      ),
    ].concat(),
  })
  if (isUserQuestComplete(interaction.user, 'healer'))
    await quests.execute({ interaction })
}

export default { command, execute }
