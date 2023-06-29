import { randomUUID } from 'crypto'
import { Colors, CommandInteraction } from 'discord.js'

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
  const character = findOrCreateCharacter(interaction.user)
  const afflictions = selectCharacterEffects(
    store.getState(),
    interaction.user.id
  ).filter((effect) => effect.debuff)
  store.dispatch(
    characterCleansed({ characterId: character.id, debuffOnly: true })
  )
  store.dispatch(
    questCompleted({ questId: quests.afflicted.id, characterId: character.id })
  )
  store.dispatch(
    effectAdded({
      interaction,
      character,
      effect: {
        id: randomUUID(),
        name: 'Afflicted',
        announcement: 'was afflicted!',
        announcementColor: Colors.DarkButNotBlack,
        buff: true,
        debuff: false,
        started: new Date().toString(),
        duration: defaultEffectDuration,
        modifiers: {
          damageBonus: afflictions.length,
        },
      },
    })
  )
}
