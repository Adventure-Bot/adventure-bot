import { randomUUID } from 'crypto'
import { CommandInteraction } from 'discord.js'

import { applyShrine } from '@adventure-bot/encounters/shrine/applyShrine'
import { shrineEmbeds } from '@adventure-bot/encounters/shrine/shrineEmbeds'
import { Shrine } from '@adventure-bot/shrines/Shrine'
import { createEffect } from '@adventure-bot/statusEffects'
import { getAsset } from '@adventure-bot/utils'

export const slayerShrine = async (
  interaction: CommandInteraction
): Promise<void> => {
  const shrine: Shrine = {
    id: randomUUID(),
    name: "Slayer's Shrine",
    description: `This shrine fills you with an instincts of a hunter!`,
    image: getAsset('fantasy', 'characters', 'hidden hunter').s3Url,
    color: 'GREY',
    effect: createEffect('slayer'),
  }

  applyShrine({ shrine, interaction })

  interaction.editReply({
    embeds: shrineEmbeds({ shrine, interaction }),
  })
}
