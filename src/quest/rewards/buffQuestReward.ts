import { CommandInteraction, MessageEmbed } from 'discord.js'

import inspect from '@adventure-bot/commands/inspect/inspect'
import { Quest } from '@adventure-bot/quest/Quest'
import { StatusEffect } from '@adventure-bot/statusEffects/StatusEffect'
import store from '@adventure-bot/store'
import {
  effectAdded,
  questCompleted,
} from '@adventure-bot/store/slices/characters'

export async function buffQuestReward(
  interaction: CommandInteraction,
  effect: StatusEffect,
  quest: Quest
): Promise<void> {
  const embeds = [
    new MessageEmbed({
      title: `${quest.title} Complete!`,
      description: quest.victoryText,
    }),
  ]

  store.dispatch(effectAdded({ characterId: interaction.user.id, effect }))

  store.dispatch(
    questCompleted({ questId: quest.id, characterId: interaction.user.id })
  )

  await interaction.followUp({
    fetchReply: true,
    embeds,
  })

  await inspect.execute(interaction)
}
