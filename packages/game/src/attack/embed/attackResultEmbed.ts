import { CommandInteraction, MessageEmbed } from 'discord.js'

import { Emoji } from '@adventure-bot/game/Emoji'
import {
  AttackResult,
  attackResultHeadline,
  attackRollText,
} from '@adventure-bot/game/attack'
import { hpBarField } from '@adventure-bot/game/character'

import {
  attackFlavorText,
  attackResultEmbedCompact,
} from './attackResultEmbedCompact'

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
      }) + (variant === 'retaliation' ? ' (retaliation)' : ''),
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
        adjustment: ['hit', 'crit'].includes(result.outcome)
          ? -result.damage
          : 0,
        showName: true,
      }),
    ],
  })
    .setThumbnail(result.attacker.profile)
    .setImage(result.defender.profile)
}
