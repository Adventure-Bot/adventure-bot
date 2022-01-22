import { SlashCommandBuilder } from '@discordjs/builders'
import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from 'discord.js'

import { getUserCharacter } from '@adventure-bot/character'
import { Quest } from '@adventure-bot/quest/Quest'
import { getCompletedQuests } from '@adventure-bot/quest/getCompletedQuests'
import { QuestId, isQuestId } from '@adventure-bot/quest/quests'
import { blessedBuffQuestReward } from '@adventure-bot/quest/rewards/blessedBuffQuest'
import { healerQuestReward } from '@adventure-bot/quest/rewards/healerQuestReward'
import { slayerBuffQuestReward } from '@adventure-bot/quest/rewards/slayerBuffQuestReward'
import { survivorBuffQuestReward } from '@adventure-bot/quest/rewards/survivorBuffQuest'
import { progressBar } from '@adventure-bot/utils/progress-bar'

export const command = new SlashCommandBuilder()
  .setName('quests')
  .setDescription('Check your quest progress.')

export const execute = async (
  interaction: CommandInteraction
): Promise<void> => {
  const character = getUserCharacter(interaction.user)
  const completedQuests = getCompletedQuests(character)
  if (Object.values(character.quests).length === 0) {
    await interaction.followUp(
      `You do not have any active quests. \`/adventure\` to find some!`
    )
    return
  }
  const embed = new MessageEmbed({
    title: 'Quests',
  })
  Object.values(character.quests).forEach((quest) => {
    embed.addField(
      quest.title,
      `${quest.objective}\n${progressBar(
        quest.progress / quest.totalRequired
      )} ${quest.progress}/${quest.totalRequired}`
    )
  })
  const message = await interaction.followUp({
    embeds: [embed],
    components: getComponents(completedQuests),
    fetchReply: true,
  })
  if (!(message instanceof Message)) return
  const reply = await message
    .awaitMessageComponent({
      filter: (i) => {
        i.deferUpdate()
        return i.user.id === interaction.user.id
      },
      componentType: 'BUTTON',
    })
    .finally(() => message.edit({ components: [] }))
  if (isQuestId(reply.customId))
    await completeQuest(interaction, reply.customId)
}

export default { command, execute }

function getComponents(completedQuests: Map<string, Quest>) {
  if (completedQuests.size === 0) return []
  return [
    new MessageActionRow({
      components: Array.from(completedQuests.entries()).map(
        ([id, quest]) =>
          new MessageButton({
            customId: id,
            label: `Turn in ${quest.title} quest`,
            style: 'PRIMARY',
          })
      ),
    }),
  ]
}

const completeQuest = async (
  interaction: CommandInteraction,
  questId: QuestId
): Promise<void> => {
  switch (questId) {
    case 'slayer':
      return await slayerBuffQuestReward(interaction)
    case 'survivor':
      return await survivorBuffQuestReward(interaction)
    case 'blessed':
      return await blessedBuffQuestReward(interaction)
    case 'healer':
      return await healerQuestReward(interaction)
  }
}
