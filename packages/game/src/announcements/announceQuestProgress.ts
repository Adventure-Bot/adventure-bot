import { MessageEmbed, TextChannel } from 'discord.js'

import { decoratedName } from '@adventure-bot/game/character'
import quests from '@adventure-bot/game/commands/quests'
import { isQuestComplete, questProgressField } from '@adventure-bot/game/quest'
import store from '@adventure-bot/game/store'
import { startAppListening } from '@adventure-bot/game/store/listenerMiddleware'
import { selectCharacterById } from '@adventure-bot/game/store/selectors'
import { questProgressed } from '@adventure-bot/game/store/slices/characters'

import { sendEmbeds } from './sendEmbeds'

export function announceQuestProgress(channel: TextChannel): void {
  startAppListening({
    actionCreator: questProgressed,
    effect: async ({
      payload: { characterId, questId, amount, interaction },
    }) => {
      if (interaction.channel?.id != channel.id) return
      const character = selectCharacterById(store.getState(), characterId)
      if (!character) return
      const quest = character.quests[questId]
      if (!quest) return
      const isComplete = isQuestComplete(quest)

      await sendEmbeds({
        channel,
        embeds: [
          new MessageEmbed({
            title: `${decoratedName(character)} ${
              isComplete ? 'completed' : 'made progress on'
            } their ${quest.title} quest!`,
            fields: isComplete ? [] : [questProgressField(quest, amount)],
            color: 'YELLOW',
          }),
        ],
      })
      if (isComplete)
        await quests.execute({ interaction, replyType: 'followUp' })
    },
  })
}
