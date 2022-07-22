import { MessageEmbed, TextChannel } from 'discord.js'

import { sendEmbeds } from '@adventure-bot/game/announcements/sendEmbeds'
import { decoratedName } from '@adventure-bot/game/character'
import { quests } from '@adventure-bot/game/quest'
import store from '@adventure-bot/game/store'
import { startAppListening } from '@adventure-bot/game/store/listenerMiddleware'
import { selectCharacterById } from '@adventure-bot/game/store/selectors'
import { questGranted } from '@adventure-bot/game/store/slices/characters'

export function announceQuestGranted(channel: TextChannel): void {
  startAppListening({
    actionCreator: questGranted,
    effect: ({ payload: { characterId, questId, messageId } }) => {
      const character = selectCharacterById(store.getState(), characterId)
      if (!character) return
      const quest = quests[questId]
      const embed = new MessageEmbed({
        title: `${decoratedName(character)} was charged with the ${
          quest.title
        } quest.`,
      })
      sendEmbeds({ messageId, channel, embeds: [embed] })
    },
  })
}
