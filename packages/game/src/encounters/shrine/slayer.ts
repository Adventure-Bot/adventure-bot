import { randomUUID } from 'crypto'

import { shrineEncounter } from '@adventure-bot/game/encounters/shrine'
import { createEffect } from '@adventure-bot/game/statusEffects'
import { CommandHandlerOptions, asset } from '@adventure-bot/game/utils'

export const slayerShrine = async ({
  interaction,
  replyType = 'editReply',
}: CommandHandlerOptions): Promise<void> => {
  return shrineEncounter({
    interaction,
    replyType,
    shrine: {
      id: randomUUID(),
      name: "Slayer's Shrine",
      description: `This shrine fills you with the instincts of a hunter!`,
      image: asset('fantasy', 'characters', 'hidden hunter').s3Url,
      color: 'GREY',
      effect: createEffect('slayer'),
    },
  })
}
