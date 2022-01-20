import { SlashCommandBuilder } from '@discordjs/builders'
import { CommandInteraction, MessageEmbed } from 'discord.js'
import { heal } from '../heal/heal'
import { getUserCharacter } from '../character/getUserCharacter'
import { hpBarField } from '../character/hpBar/hpBarField'
import { Emoji } from '../Emoji'
import { updateUserQuestProgess } from '../quest/updateQuestProgess'
import { questProgressField } from '../quest/questProgressField'
import { isUserQuestComplete } from '../quest/isQuestComplete'
import quests from './quests'
import { getAsset } from '../utils/getAsset'
import cooldowns from './cooldowns'

export const command = new SlashCommandBuilder()
  .setName('heal')
  .setDescription('Heal someone')
  .addUserOption((option) =>
    option.setName('target').setDescription('Whom to heal')
  )

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const target =
    (interaction.options.data[0] && interaction.options.data[0].user) ||
    interaction.user

  const healer = interaction.user
  if (!target) {
    await interaction.editReply(`You must specify a target @player`)
    return
  }

  // TODO: a better way?
  getUserCharacter(target) // ensure character exists for proper interactions
  const result = heal(healer.id, target.id)
  if (!result) {
    interaction.editReply('No result. This should not happen.')
    return
  }
  if (result.outcome === 'cooldown') {
    await cooldowns.execute(interaction)
    return
  }
  const character = updateUserQuestProgess(healer, 'healer', result.amount)

  await interaction.editReply({
    embeds: [
      new MessageEmbed({
        title: `${healer.username} ${
          healer.username === target.username
            ? 'self healed'
            : 'healed ' + target.username
        } for +${result.amount} ${Emoji(interaction, 'heal')}`,
        fields: [
          hpBarField({
            character: getUserCharacter(target),
            adjustment: result.amount,
          }),
        ].concat(
          character.quests.healer
            ? questProgressField(character.quests.healer)
            : []
        ),
      }).setImage(
        getAsset('fantasy', 'magic', 'a glowing hand applying healing magic')
          .s3Url
      ),
    ].concat(),
  })
  if (isUserQuestComplete(healer, 'healer')) await quests.execute(interaction)
}

export default { command, execute }
