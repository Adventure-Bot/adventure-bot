import {
  CommandInteraction,
  Message,
  MessageActionRow,
  MessageEmbed,
  MessageSelectMenu,
} from 'discord.js'

import {
  awardXP,
  decoratedName,
  findOrCreateCharacter,
} from '@adventure-bot/game/character'
import questsCommand from '@adventure-bot/game/commands/quests'
import { isQuestId, questEmbed, quests } from '@adventure-bot/game/quest'
import store from '@adventure-bot/game/store'
import { selectAvailableQuests } from '@adventure-bot/game/store/selectors'
import { questGranted } from '@adventure-bot/game/store/slices/characters'
import { asset } from '@adventure-bot/game/utils'

export const chattyTavernkeepers = async (
  interaction: CommandInteraction
): Promise<void> => {
  const character = findOrCreateCharacter(interaction.user)
  const state = store.getState()
  const availableQuests = selectAvailableQuests(state, character)

  if (availableQuests.length === 0) {
    interaction.followUp({
      embeds: [
        new MessageEmbed({
          title: `${decoratedName(character)} met a chatty tavernkeeper!`,
          description: `You're all caught up on the latest, friend!`,
        })
          .setImage(asset('fantasy', 'places', 'chatty tavernkeepers').s3Url)
          .setThumbnail(character.profile),
      ].concat(questEmbed(character) ?? []),
    })
    return
  }
  const message = await interaction.followUp({
    fetchReply: true,
    embeds: [
      new MessageEmbed({
        title: `${decoratedName(character)} met a chatty tavernkeeper!`,
        description:
          "Turns out they know someone's got a thing needs doing.\n\nCompensation? Of course!",
      })
        .setImage(asset('fantasy', 'places', 'chatty tavernkeepers').s3Url)
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
  await interaction.followUp(
    `${decoratedName(character)} was charged with the ${
      quests[questId].title
    } quest.`
  )
  awardXP({
    characterId: interaction.user.id,
    amount: 1,
    messageId: message.id,
  })
  await questsCommand.execute({ interaction })
}
