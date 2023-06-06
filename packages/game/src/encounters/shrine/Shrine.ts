import { ColorResolvable } from 'discord.js'

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
  color: ColorResolvable
}

export async function shrineEncounter({
  shrine,
  interaction,
  replyType = 'editReply',
}: CommandHandlerOptions & { shrine: Shrine }): Promise<void> {
  const { id: messageId } = await interaction[replyType]({
    embeds: shrineEmbeds({ shrine, interaction }),
  })
  applyShrine({ shrine, interaction, messageId })
}
