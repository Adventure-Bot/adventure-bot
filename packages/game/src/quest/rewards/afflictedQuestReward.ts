import { CommandInteraction } from 'discord.js'

import { findOrCreateCharacter } from '@adventure-bot/game/character'
import { quests } from '@adventure-bot/game/quest/quests'
import { defaultEffectDuration } from '@adventure-bot/game/statusEffects/templates/defaultEffectDuration'
import store from '@adventure-bot/game/store'
import { selectCharacterEffects } from '@adventure-bot/game/store/selectors'
import { questCompleted } from '@adventure-bot/game/store/slices/characters'
import {
  characterCleansed,
  effectAdded,
} from '@adventure-bot/game/store/slices/statusEffects'

export const afflictedQuestReward = async (
  interaction: CommandInteraction
): Promise<void> => {
  const afflictions = selectCharacterEffects(
    store.getState(),
    interaction.user.id
  )
  const character = findOrCreateCharacter(interaction.user)
  store.dispatch(
    characterCleansed({ characterId: character.id, debuffOnly: true })
  )
  store.dispatch(
    questCompleted({ questId: quests.afflicted.id, characterId: character.id })
  )
  store.dispatch(
    effectAdded({
      character,
      effect: {
        id: 'afflicted',
        name: 'Afflicted',
        announcement: 'was afflicted!',
        announcementColor: 'DARK_BUT_NOT_BLACK',
        buff: true,
        debuff: false,
        started: new Date().toISOString(),
        duration: defaultEffectDuration,
        modifiers: {
          damageBonus: afflictions.length,
        },
      },
    })
  )
}
