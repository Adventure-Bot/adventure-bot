import { MessageEmbed, TextChannel } from 'discord.js'

import { sendEmbeds } from '@adventure-bot/game/announcements/sendEmbeds'
import { decoratedName } from '@adventure-bot/game/character'
import { questProgressField } from '@adventure-bot/game/quest'
import store from '@adventure-bot/game/store'
import { startAppListening } from '@adventure-bot/game/store/listenerMiddleware'
import { selectCharacterById } from '@adventure-bot/game/store/selectors'
import { questProgressed } from '@adventure-bot/game/store/slices/characters'

export function announceQuestProgressed(channel: TextChannel): void {
  startAppListening({
    actionCreator: questProgressed,
    effect: ({ payload: { characterId, questId, messageId } }) => {
      const character = selectCharacterById(store.getState(), characterId)
      if (!character) return
      const quest = character.quests[questId]
      if (!quest) return
      const embed = new MessageEmbed({
        title: `${decoratedName(character)} progressed in their ${
          quest.title
        } quest!`,
        fields: [questProgressField(quest)],
      })
      sendEmbeds({ messageId, channel, embeds: [embed] })
    },
  })
}
