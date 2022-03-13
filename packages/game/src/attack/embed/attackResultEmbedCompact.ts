import { CommandInteraction, MessageEmbed } from 'discord.js'

import {
  AttackResult,
  attackResultHeadline,
  playerAttack,
} from '@adventure-bot/game/attack'
import { accuracyDescriptor } from '@adventure-bot/game/attack/embed/accuracyDescriptor'
import { damageDescriptor } from '@adventure-bot/game/attack/embed/damageDescriptor'
import { hpBarField } from '@adventure-bot/game/character'

export function attackResultEmbedCompact({
  result,
  interaction,
}: {
  result: AttackResult
  interaction: CommandInteraction
}): MessageEmbed {
  return new MessageEmbed({
    title: attackResultHeadline({
      interaction,
      result,
    }),
    description: attackFlavorText(result),
    fields: [
      hpBarField({
        character: result.defender,
        adjustment: result.outcome === 'hit' ? -result.damage : 0,
        showName: true,
      }),
    ],
  }).setThumbnail(result.attacker.profile)
}
export const attackFlavorText = (
  result: ReturnType<typeof playerAttack>
): string =>
  result
    ? `${accuracyDescriptor(result)} ${damageDescriptor(result)}`
    : 'No result'
