import { randomUUID } from 'crypto'
import { Colors } from 'discord.js'

import { shrineEncounter } from '@adventure-bot/game/encounters/shrine'
import { createEffect } from '@adventure-bot/game/statusEffects'
import { CommandHandlerOptions, asset } from '@adventure-bot/game/utils'

export async function vigorShrine({
  interaction,
}: CommandHandlerOptions): Promise<void> {
  return shrineEncounter({
    interaction,

    shrine: {
      id: randomUUID(),
      name: 'Vigor Shrine',
      description: `The shrine fills you with renewed vigor!`,
      image: asset(
        'fantasy',
        'places',
        'a beautiful glowing statue in a serene forest'
      ).s3Url,
      color: Colors.White,
      effect: createEffect('invigorated'),
    },
  })
}
