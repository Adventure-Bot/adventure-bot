import { SlashCommandBuilder } from 'discord.js'
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  CommandInteraction,
  ComponentType,
  EmbedBuilder,
  Message,
} from 'discord.js'

import { findOrCreateCharacter } from '@adventure-bot/game/character'
import {
  Quest,
  QuestId,
  afflictedQuestReward,
  blessedBuffQuestReward,
  getCompletedQuests,
  healerQuestReward,
  isQuestId,
  slayerBuffQuestReward,
  survivorBuffQuestReward,
  travelerBuffQuestReward,
} from '@adventure-bot/game/quest'
import { CommandHandlerOptions, progressBar } from '@adventure-bot/game/utils'

import { questEmbed } from '../quest/questEmbed'

export const command = new SlashCommandBuilder()
  .setName('quests')
  .setDescription('Check your quest progress.')

export const execute = async ({
  interaction,
}: CommandHandlerOptions): Promise<void> => {
  const character = findOrCreateCharacter(interaction.user)
  const completedQuests = getCompletedQuests(character)
  if (Object.values(character.quests).length === 0) {
    await interaction.followUp(
      `You do not have any active quests. \`/adventure\` to find some!`
    )
    return
  }
  const embed = new EmbedBuilder({
    title: 'Quests',
    color: Colors.Yellow,
  })
  Object.values(character.quests).forEach((quest) => {
    embed.addFields([
      {
        name: quest.title,
        value: `${quest.objective}\n
      ${quest.reward}\n
      ${progressBar(quest.progress / quest.totalRequired)} ${quest.progress}/${
          quest.totalRequired
        }`,
      },
    ])
  })

  const message = await interaction.followUp({
    embeds: [
      new EmbedBuilder({
        title: 'Quests',
        description: `You have ${
          Object.values(character.quests).length
        } active quests.`,
        color: Colors.Yellow,
      }),
      ...Object.values(character.quests).map(questEmbed),
    ],
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
      componentType: ComponentType.Button,
    })
    .finally(() => message.edit({ components: [] }))
  if (isQuestId(reply.customId))
    await completeQuest(interaction, reply.customId)
}

export default { command, execute }

function getComponents(completedQuests: Map<string, Quest>) {
  if (completedQuests.size === 0) return []
  return [
    new ActionRowBuilder<ButtonBuilder>({
      components: Array.from(completedQuests.entries()).map(
        ([id, quest]) =>
          new ButtonBuilder({
            customId: id,
            label: `Turn in ${quest.title} quest`,
            style: ButtonStyle.Primary,
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
    case 'afflicted':
      return await afflictedQuestReward(interaction)
    case 'slayer':
      return await slayerBuffQuestReward(interaction)
    case 'survivor':
      return await survivorBuffQuestReward(interaction)
    case 'blessed':
      return await blessedBuffQuestReward(interaction)
    case 'healer':
      return await healerQuestReward(interaction)
    case 'traveler':
      return await travelerBuffQuestReward(interaction)
  }
}
