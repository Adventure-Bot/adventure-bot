import { CommandInteraction, MessageEmbed } from 'discord.js'

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
  const embeds = [
    new MessageEmbed({
      title: `${quest.title} Complete!`,
      description: quest.victoryText,
    }),
  ]

  const message = await interaction.followUp({
    embeds,
  })
  store.dispatch(
    effectAdded({
      characterId: interaction.user.id,
      effect,
      messageId: message.id,
    })
  )
  store.dispatch(
    questCompleted({ questId: quest.id, characterId: interaction.user.id })
  )

  await inspect.execute({ interaction })
}
