import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageAttachment,
  MessageEmbed,
  MessageSelectMenu,
} from 'discord.js'

import {
  awardXP,
  decoratedName,
  getUserCharacter,
  xpGainField,
} from '@adventure-bot/game/character'
import questsCommand from '@adventure-bot/game/commands/quests'
import { isQuestId, questEmbed, quests } from '@adventure-bot/game/quest'
import store from '@adventure-bot/game/store'
import { selectAvailableQuests } from '@adventure-bot/game/store/selectors'
import { questGranted } from '@adventure-bot/game/store/slices/characters'

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
          title: `${decoratedName(character)} met the Chatty Tavernkeepers!`,
          description: `You're all caught up on the latest, friend!`,
        })
          .setImage('attachment://Tavernkeepers.jpg')
          .setThumbnail(character.profile),
      ].concat(questEmbed(character) ?? []),
    })
    return
  }
  const message = await interaction[followUp ? 'followUp' : 'editReply']({
    fetchReply: true,
    files: [new MessageAttachment('./images/Tavernkeepers.jpg')],
    embeds: [
      new MessageEmbed({
        title: `${decoratedName(character)} met the Chatty Tavernkeepers!`,
        description:
          "Turns out they know someone's got a thing needs doing.\n\nCompensation? Of course!",
        fields: [xpGainField(1)],
      })
        .setImage('attachment://Tavernkeepers.jpg')
        .setThumbnail(character.profile),
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
