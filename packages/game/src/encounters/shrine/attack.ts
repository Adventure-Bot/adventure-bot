import { randomUUID } from 'crypto'

import { shrineEncounter } from '@adventure-bot/game/encounters/shrine'
import { createEffect } from '@adventure-bot/game/statusEffects'
import { CommandHandlerOptions, asset } from '@adventure-bot/game/utils'

export const attackShrine = async ({
  interaction,
  replyType = 'editReply',
}: CommandHandlerOptions): Promise<void> => {
  return shrineEncounter({
    interaction,
    replyType,
    shrine: {
      id: randomUUID(),
      name: 'Shrine of Agression',
      description: `This shrine fills you with a rage!`,
      image: asset('fantasy', 'places', 'magical obelisk with a fiery aura')
        .s3Url,
      color: 'RED',
      effect: createEffect('aggression'),
    },
  })
}
