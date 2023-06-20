import { MessageEmbed } from 'discord.js'

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

export async function attackResultEmbed({
  result,
  variant = 'default',
}: {
  result: AttackResult
  variant?: 'default' | 'compact' | 'retaliation'
}): Promise<MessageEmbed> {
  if (variant === 'compact')
    return attackResultEmbedCompact({
      result,
    })

  return new MessageEmbed({
    title:
      attackResultHeadline({
        result,
      }) + (variant === 'retaliation' ? ' (retaliation)' : ''),
    description: `${await attackFlavorText(result)}
    ${attackRollText({
      result,
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
