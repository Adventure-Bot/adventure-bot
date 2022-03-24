import { randomUUID } from 'crypto'

import {
  Shrine,
  applyShrine,
  shrineEmbeds,
} from '@adventure-bot/game/encounters/shrine'
import { createEffect } from '@adventure-bot/game/statusEffects'
import { CommandHandlerOptions, asset } from '@adventure-bot/game/utils'

export async function vigorShrine({
  interaction,
  replyType = 'editReply',
}: CommandHandlerOptions): Promise<void> {
  const shrine: Shrine = {
    id: randomUUID(),
    name: 'Vigor Shrine',
    description: `The shrine fills you with renewed vigor!`,
    image: asset(
      'fantasy',
      'places',
      'a beautiful glowing statue in a serene forest'
    ).s3Url,
    color: 'WHITE',
    effect: createEffect('invigorated'),
  }

  applyShrine({ shrine, interaction })

  interaction[replyType]({
    embeds: shrineEmbeds({ shrine, interaction }),
  })
}
