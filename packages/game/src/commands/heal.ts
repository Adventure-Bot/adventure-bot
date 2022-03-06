import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction, MessageEmbed } from 'discord.js'

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
import { asset } from '@adventure-bot/game/utils'

export const command = new SlashCommandBuilder()
  .setName('heal')
  .setDescription('Heal someone')
  .addUserOption((option) =>
    option.setName('target').setDescription('Whom to heal')
  )

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const target = getUserCharacter(
    (interaction.options.data[0] && interaction.options.data[0].user) ||
      interaction.user
  )

  const healer = getUserCharacter(interaction.user)

  const result = heal(healer.id, target.id)
  if (!result) {
    interaction.editReply('No result. This should not happen.')
    return
  }
  if (result.outcome === 'cooldown') {
    await cooldowns.execute(interaction)
    return
  }
  updateUserQuestProgess(interaction.user, 'healer', result.amount)

  await interaction.editReply({
    embeds: [
      new MessageEmbed({
        title: `${decoratedName(healer)} ${
          healer.id === target.id
            ? 'self healed'
            : 'healed ' + decoratedName(target)
        } for ${EmojiModifier('heal', result.amount)}`,
        fields: [
          hpBarField({
            character: target,
            adjustment: result.amount,
          }),
        ].concat(
          healer.quests.healer ? questProgressField(healer.quests.healer) : []
        ),
      }).setImage(
        asset('fantasy', 'magic', 'a glowing hand applying healing magic').s3Url
      ),
    ].concat(),
  })
  if (isUserQuestComplete(interaction.user, 'healer'))
    await quests.execute(interaction)
}

export default { command, execute }
