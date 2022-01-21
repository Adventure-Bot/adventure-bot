import { randomUUID } from 'crypto'
import { CommandInteraction } from 'discord.js'
import { Shrine } from '@adventure-bot/shrines/Shrine'
import { shrineEmbeds } from '@adventure-bot/encounters/shrine/shrineEmbeds'
import { applyShrine } from '@adventure-bot/encounters/shrine/applyShrine'
import { getAsset } from '@adventure-bot/utils/getAsset'
import { createEffect } from '@adventure-bot/statusEffects'

export const armorShrine = async (
  interaction: CommandInteraction
): Promise<void> => {
  const shrine: Shrine = {
    id: randomUUID(),
    color: 'YELLOW',
    description: `This shrine will protect you during your journeys.`,
    image: getAsset('fantasy', 'items', 'a shield chiseled out of a stone')
      .s3Url,
    effect: createEffect('protectedEffect'),
    name: 'Shrine of Protection',
  }
  applyShrine({ shrine, interaction })

  interaction.editReply({
    embeds: shrineEmbeds({ shrine, interaction }),
  })
}
