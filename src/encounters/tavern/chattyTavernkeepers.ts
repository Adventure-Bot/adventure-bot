import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageAttachment,
  MessageEmbed,
  MessageSelectMenu,
} from 'discord.js'

import { awardXP } from '@adventure-bot/character'
import { getUserCharacter } from '@adventure-bot/character'
import { xpGainField } from '@adventure-bot/character'
import questsCommand from '@adventure-bot/commands/quests'
import { questEmbed } from '@adventure-bot/quest/questEmbed'
import { isQuestId, quests } from '@adventure-bot/quest/quests'
import store from '@adventure-bot/store'
import { selectAvailableQuests } from '@adventure-bot/store/selectors'
import { questGranted } from '@adventure-bot/store/slices/characters'

// TODO: omit quests the user already has
export const chattyTavernkeepers = async (
  interaction: CommandInteraction,
  followUp = false
): Promise<void> => {
  awardXP(interaction.user.id, 1)
  const character = getUserCharacter(interaction.user)
  const state = store.getState()
  const availableQuests = selectAvailableQuests(state, character)

  if (availableQuests.length === 0) {
    interaction[followUp ? 'followUp' : 'editReply']({
      files: [new MessageAttachment('./images/Tavernkeepers.jpg')],
      embeds: [
        new MessageEmbed({
          title: 'Chatty Tavernkeepers!',
          description: `You're all caught up on the latest, friend!`,
        }).setImage('attachment://Tavernkeepers.jpg'),
      ].concat(questEmbed(character) ?? []),
    })
    return
  }
  const message = await interaction[followUp ? 'followUp' : 'editReply']({
    fetchReply: true,
    files: [new MessageAttachment('./images/Tavernkeepers.jpg')],
    embeds: [
      new MessageEmbed({
        title: 'Chatty Tavernkeepers!',
        description:
          "Turns out they know someone's got a thing needs doing.\n\nCompensation? Of course!",
        fields: [xpGainField(interaction, 1)],
      }).setImage('attachment://Tavernkeepers.jpg'),
    ].concat(questEmbed(character) ?? []),
    components: [
      new MessageActionRow({
        components: [
          new MessageSelectMenu({
            customId: 'quest',
            placeholder: 'So... you in or what?',
          }).addOptions(
            availableQuests.map((quest) => ({
              label: quest.title,
              value: quest.id,
              description: `${quest.objective}: ${quest.reward}`,
            }))
          ),
        ],
      }),
    ],
  })

  if (!(message instanceof Message)) return
  const response = await message
    .awaitMessageComponent({
      filter: (i) => {
        i.deferUpdate()
        return i.user.id === interaction.user.id
      },
      componentType: 'SELECT_MENU',
      time: 60000,
    })
    .catch(() => {
      interaction.followUp('Another time, perhaps!')
    })
  if (!response) {
    interaction.followUp('Another time, perhaps!')
    return
  }
  const questId = response.values[0]
  if (!isQuestId(questId)) {
    interaction.followUp(`${questId} is not a valid quest id`)
    return
  }
  store.dispatch(questGranted({ characterId: character.id, questId }))
  console.log(`quest accepted ${questId}`)
  await interaction.followUp(
    `You have been charged with the ${quests[questId].title} quest.`
  )
  await questsCommand.execute(interaction)
}
