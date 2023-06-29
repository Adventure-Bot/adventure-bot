import { CommandInteraction, EmbedBuilder } from 'discord.js'

import { findOrCreateCharacter } from '@adventure-bot/game/character'
import inspect from '@adventure-bot/game/commands/inspect/inspect'
import { Quest } from '@adventure-bot/game/quest'
import { StatusEffect } from '@adventure-bot/game/statusEffects'
import store from '@adventure-bot/game/store'
import { questCompleted } from '@adventure-bot/game/store/slices/characters'
import { effectAdded } from '@adventure-bot/game/store/slices/statusEffects'

export async function buffQuestReward(
  interaction: CommandInteraction,
  effect: StatusEffect,
  quest: Quest
): Promise<void> {
  const character = findOrCreateCharacter(interaction.user)
  const embeds = [
    new EmbedBuilder({
      title: `${quest.title} Complete!`,
      description: quest.victoryText,
    }),
  ]

  await interaction.followUp({
    embeds,
  })
  store.dispatch(
    effectAdded({
      interaction,
      character,
      effect,
    })
  )
  store.dispatch(
    questCompleted({ questId: quest.id, characterId: character.id })
  )

  await inspect.execute({ interaction })
}
