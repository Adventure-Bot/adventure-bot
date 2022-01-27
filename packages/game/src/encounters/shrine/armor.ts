import { randomUUID } from 'crypto'
import { CommandInteraction } from 'discord.js'

import {
  Shrine,
  applyShrine,
  shrineEmbeds,
} from '@adventure-bot/game/encounters/shrine'
import { createEffect } from '@adventure-bot/game/statusEffects'
import { asset } from '@adventure-bot/game/utils'

export const armorShrine = async (
  interaction: CommandInteraction
): Promise<void> => {
  const shrine: Shrine = {
    id: randomUUID(),
    color: 'YELLOW',
    description: `This shrine will protect you during your journeys.`,
    image: asset('fantasy', 'items', 'a shield chiseled out of a stone').s3Url,
    effect: createEffect('protectedEffect'),
    name: 'Shrine of Protection',
  }
  applyShrine({ shrine, interaction })

  interaction.editReply({
    embeds: shrineEmbeds({ shrine, interaction }),
  })
}
