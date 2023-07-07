import {
  applyShrine,
  shrineEmbeds,
} from '@adventure-bot/game/encounters/shrine'
import { StatusEffect } from '@adventure-bot/game/statusEffects'
import { CommandHandlerOptions } from '@adventure-bot/game/utils'

export type Shrine = {
  id: string
  name: string
  effect: StatusEffect
  description: string
  image: string
  color: number
}

export async function shrineEncounter({
  shrine,
  interaction,
}: CommandHandlerOptions & { shrine: Shrine }): Promise<void> {
  await interaction.channel?.send({
    embeds: shrineEmbeds({ shrine, interaction }),
  })
  applyShrine({ shrine, interaction })
}
