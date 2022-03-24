import { randomUUID } from 'crypto'

import {
  Shrine,
  applyShrine,
  shrineEmbeds,
} from '@adventure-bot/game/encounters/shrine'
import { createEffect } from '@adventure-bot/game/statusEffects'
import { CommandHandlerOptions, asset } from '@adventure-bot/game/utils'

export const slayerShrine = async ({
  interaction,
  replyType = 'editReply',
}: CommandHandlerOptions): Promise<void> => {
  const shrine: Shrine = {
    id: randomUUID(),
    name: "Slayer's Shrine",
    description: `This shrine fills you with the instincts of a hunter!`,
    image: asset('fantasy', 'characters', 'hidden hunter').s3Url,
    color: 'GREY',
    effect: createEffect('slayer'),
  }

  applyShrine({ shrine, interaction })

  interaction[replyType]({
    embeds: shrineEmbeds({ shrine, interaction }),
  })
}
