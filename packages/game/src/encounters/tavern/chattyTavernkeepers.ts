import {
  ActionRowBuilder,
  CommandInteraction,
  ComponentType,
  EmbedBuilder,
  Message,
  StringSelectMenuBuilder,
} from 'discord.js'

import {
  awardXP,
  decoratedName,
  findOrCreateCharacter,
} from '@adventure-bot/game/character'
import questsCommand from '@adventure-bot/game/commands/quests'
import {
  characterQuestSummary,
  isQuestId,
  quests,
} from '@adventure-bot/game/quest'
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
    interaction.channel?.send({
      embeds: [
        new EmbedBuilder({
          title: `${decoratedName(character)} met a chatty tavernkeeper!`,
          description: `You're all caught up on the latest, friend!`,
        })
          .setImage(asset('fantasy', 'places', 'chatty tavernkeepers').s3Url)
          .setThumbnail(character.profile),
      ].concat(characterQuestSummary(character) ?? []),
    })
    return
  }
  const message = await interaction.channel?.send({
    embeds: [
      new EmbedBuilder({
        title: `${decoratedName(character)} met a chatty tavernkeeper!`,
        description:
          "Turns out they know someone's got a thing needs doing.\n\nCompensation? Of course!",
      })
        .setImage(asset('fantasy', 'places', 'chatty tavernkeepers').s3Url)
        .setThumbnail(character.profile),
    ].concat(characterQuestSummary(character) ?? []),
    components: [
      new ActionRowBuilder<StringSelectMenuBuilder>({
        components: [
          new StringSelectMenuBuilder({
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
      componentType: ComponentType.StringSelect,
      time: 60000,
    })
    .catch(() => {
      interaction.channel?.send('Another time, perhaps!')
    })
  if (!response) return
  const questId = response.values[0]
  response.valueOf()
  if (!isQuestId(questId)) {
    interaction.channel?.send(`${questId} is not a valid quest id`)
    return
  }
  store.dispatch(questGranted({ characterId: character.id, questId }))
  await interaction.channel?.send(
    `${decoratedName(character)} was charged with the ${
      quests[questId].title
    } quest.`
  )
  awardXP({
    characterId: interaction.user.id,
    amount: 1,
  })
  await questsCommand.execute({ interaction })
}
