import { randomUUID } from 'crypto'
import { CommandInteraction } from 'discord.js'

import {
  Shrine,
  applyShrine,
  shrineEmbeds,
} from '@adventure-bot/game/encounters/shrine'
import { createEffect } from '@adventure-bot/game/statusEffects'
import { asset } from '@adventure-bot/game/utils'

export const slayerShrine = async (
  interaction: CommandInteraction
): Promise<void> => {
  const shrine: Shrine = {
    id: randomUUID(),
    name: "Slayer's Shrine",
    description: `This shrine fills you with an instincts of a hunter!`,
    image: asset('fantasy', 'characters', 'hidden hunter').s3Url,
    color: 'GREY',
    effect: createEffect('slayer'),
  }

  applyShrine({ shrine, interaction })

  interaction.editReply({
    embeds: shrineEmbeds({ shrine, interaction }),
  })
}
