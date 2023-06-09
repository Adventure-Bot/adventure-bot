import { MessageEmbed, TextChannel } from 'discord.js'

import { decoratedName } from '@adventure-bot/game/character'
import { questProgressField } from '@adventure-bot/game/quest'
import store from '@adventure-bot/game/store'
import { startAppListening } from '@adventure-bot/game/store/listenerMiddleware'
import { selectCharacterById } from '@adventure-bot/game/store/selectors'
import { questProgressed } from '@adventure-bot/game/store/slices/characters'

import { sendEmbeds } from './sendEmbeds'

export function announceQuestProgressed(channel: TextChannel): void {
  startAppListening({
    actionCreator: questProgressed,
    effect: async ({ payload: { characterId, questId, amount } }) => {
      const character = selectCharacterById(store.getState(), characterId)
      if (!character) return
      const quest = character.quests[questId]
      if (!quest) return

      const embeds = [
        new MessageEmbed({
          title: `${decoratedName(character)} made progress on their ${
            quest.title
          } quest!`,
          fields: [questProgressField(quest, amount)],
          color: 'YELLOW',
        }),
      ]
      sendEmbeds({ channel, embeds })
    },
  })
}
