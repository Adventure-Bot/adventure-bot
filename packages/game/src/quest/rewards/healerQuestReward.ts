import { CommandInteraction } from 'discord.js'

import { findOrCreateCharacter } from '@adventure-bot/game/character'
import { buffQuestReward } from '@adventure-bot/game/quest'
import { quests } from '@adventure-bot/game/quest/quests'
import { createEffect } from '@adventure-bot/game/statusEffects'
import store from '@adventure-bot/game/store'
import { healed } from '@adventure-bot/game/store/slices/characters'

export const healerQuestReward = async (
  interaction: CommandInteraction
): Promise<void> => {
  // heal to full
  const character = findOrCreateCharacter(interaction.user)
  store.dispatch(
    healed({
      character,
      amount: character.statsModified.maxHP - character.hp,
    })
  )
  buffQuestReward(interaction, createEffect('healer'), quests.healer)
}
