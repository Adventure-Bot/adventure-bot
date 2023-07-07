import { randomUUID } from 'crypto'
import { Colors } from 'discord.js'

import { shrineEncounter } from '@adventure-bot/game/encounters/shrine'
import { createEffect } from '@adventure-bot/game/statusEffects'
import { CommandHandlerOptions, asset } from '@adventure-bot/game/utils'

export const attackShrine = async ({
  interaction,
}: CommandHandlerOptions): Promise<void> => {
  return shrineEncounter({
    interaction,

    shrine: {
      id: randomUUID(),
      name: 'Shrine of Agression',
      description: `This shrine fills you with a rage!`,
      image: asset('fantasy', 'places', 'magical obelisk with a fiery aura')
        .s3Url,
      color: Colors.Red,
      effect: createEffect('aggression'),
    },
  })
}
