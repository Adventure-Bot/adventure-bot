import { randomUUID } from 'crypto'

import { shrineEncounter } from '@adventure-bot/game/encounters/shrine'
import { createEffect } from '@adventure-bot/game/statusEffects'
import { CommandHandlerOptions, asset } from '@adventure-bot/game/utils'

export const armorShrine = async ({
  interaction,
  replyType = 'editReply',
}: CommandHandlerOptions): Promise<void> => {
  return shrineEncounter({
    interaction,
    replyType,
    shrine: {
      id: randomUUID(),
      color: 'YELLOW',
      description: `This shrine will protect you in your journeys.`,
      image: asset('fantasy', 'items', 'a shield chiseled out of a stone')
        .s3Url,
      effect: createEffect('protectedEffect'),
      name: 'Shrine of Protection',
    },
  })
}
