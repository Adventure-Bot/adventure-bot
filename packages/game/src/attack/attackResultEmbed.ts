import { CommandInteraction, MessageEmbed } from 'discord.js'

import { Emoji } from '@adventure-bot/game/Emoji'
import { AttackResult, attackResultHeadline } from '@adventure-bot/game/attack'
import { hpBarField } from '@adventure-bot/game/character'
import {
  attackFlavorText,
  attackRollText,
} from '@adventure-bot/game/commands/attack'

export function attackResultEmbed({
  result,
  interaction,
  variant = 'default',
}: {
  result: AttackResult
  interaction: CommandInteraction
  variant?: 'default' | 'compact' | 'retaliation'
}): MessageEmbed {
  if (variant === 'compact')
    return attackResultEmbedCompact({
      result,
      interaction,
    })

  return new MessageEmbed({
    title:
      attackResultHeadline({
        interaction,
        result,
      }) + supplementalHeadline(variant, result),
    description: `${attackFlavorText(result)}
    ${attackRollText({
      result,
      interaction,
    })}
    ${
      result.monsterDamageRoll
        ? `${Emoji('monsterDamageMax')} ${
            result.monsterDamageRoll
          } Monster Damage`
        : ''
    }`,
    fields: [
      hpBarField({
        character: result.defender,
        adjustment: result.outcome === 'hit' ? -result.damage : 0,
        showName: true,
      }),
    ],
  })
    .setThumbnail(result.attacker.profile)
    .setImage(result.defender.profile)
}

function supplementalHeadline(variant: string, result: AttackResult) {
  const supplementalHeadlines = []
  if (variant === 'retaliation') {
    supplementalHeadlines.push('retaliation')
  }
  if (result.backfire) {
    supplementalHeadlines.push('backfired!')
  }
  const supplementalHeadline = supplementalHeadlines.length
    ? ` (${supplementalHeadlines.join(', ')})`
    : ''
  return supplementalHeadline
}

function attackResultEmbedCompact({
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
