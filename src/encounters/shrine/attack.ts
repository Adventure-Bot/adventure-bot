import { randomUUID } from 'crypto'
import { CommandInteraction } from 'discord.js'

import { applyShrine } from '@adventure-bot/encounters/shrine/applyShrine'
import { shrineEmbeds } from '@adventure-bot/encounters/shrine/shrineEmbeds'
import { Shrine } from '@adventure-bot/shrines/Shrine'
import { createEffect } from '@adventure-bot/statusEffects/createEffect'
import { getAsset } from '@adventure-bot/utils/getAsset'

export const attackShrine = async (
  interaction: CommandInteraction
): Promise<void> => {
  const shrine: Shrine = {
    id: randomUUID(),
    name: 'Shrine of Agression',
    description: `This shrine fills you with a rage!`,
    image: getAsset('fantasy', 'places', 'magical obelisk with a fiery aura')
      .s3Url,
    color: 'RED',
    effect: createEffect('aggression'),
  }

  applyShrine({ shrine, interaction })

  interaction.editReply({
    embeds: shrineEmbeds({ shrine, interaction }),
  })
}
