import { randomUUID } from 'crypto'

import {
  Shrine,
  applyShrine,
  shrineEmbeds,
} from '@adventure-bot/game/encounters/shrine'
import { createEffect } from '@adventure-bot/game/statusEffects'
import { CommandHandlerOptions, asset } from '@adventure-bot/game/utils'

export const attackShrine = async ({
  interaction,
  replyType = 'editReply',
}: CommandHandlerOptions): Promise<void> => {
  const shrine: Shrine = {
    id: randomUUID(),
    name: 'Shrine of Agression',
    description: `This shrine fills you with a rage!`,
    image: asset('fantasy', 'places', 'magical obelisk with a fiery aura')
      .s3Url,
    color: 'RED',
    effect: createEffect('aggression'),
  }

  applyShrine({ shrine, interaction })

  interaction[replyType]({
    embeds: shrineEmbeds({ shrine, interaction }),
  })
}
