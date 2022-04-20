import { randomUUID } from 'crypto'

import { shrineEncounter } from '@adventure-bot/game/encounters/shrine'
import { createEffect } from '@adventure-bot/game/statusEffects'
import { CommandHandlerOptions, asset } from '@adventure-bot/game/utils'

export async function roguesGuild({
  interaction,
  replyType = 'editReply',
}: CommandHandlerOptions): Promise<void> {
  return shrineEncounter({
    shrine: {
      id: randomUUID(),
      name: "Rogues' Guild",
      description: `They teach you some trade secrets!`,
      image: asset('fantasy', 'places', 'seedy tavern').s3Url,
      color: 'DARKER_GREY',
      effect: createEffect('rogue'),
    },
    interaction,
    replyType,
  })
}
