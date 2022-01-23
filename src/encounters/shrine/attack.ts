import { randomUUID } from 'crypto'
import { CommandInteraction } from 'discord.js'

import {
  Shrine,
  applyShrine,
  shrineEmbeds,
} from '@adventure-bot/encounters/shrine'
import { createEffect } from '@adventure-bot/statusEffects'
import { asset } from '@adventure-bot/utils'

export const attackShrine = async (
  interaction: CommandInteraction
): Promise<void> => {
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

  interaction.editReply({
    embeds: shrineEmbeds({ shrine, interaction }),
  })
}
