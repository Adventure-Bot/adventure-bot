import { CommandInteraction, MessageEmbed } from 'discord.js'

import {
  AttackResult,
  attackResultHeadline,
  attackRollText,
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
    description:
      attackFlavorText(result) +
      '\n' +
      attackRollText({
        result,
        interaction,
      }),
    fields: [
      hpBarField({
        character: result.defender,
        adjustment: ['hit', 'crit'].includes(result.outcome)
          ? -result.damage
          : 0,
        showName: true,
      }),
    ],
  }).setThumbnail(result.attacker.profile)
}
export const attackFlavorText = (result: AttackResult): string =>
  result
    ? `${accuracyDescriptor(result)} ${damageDescriptor(result)}`
    : 'No result'
