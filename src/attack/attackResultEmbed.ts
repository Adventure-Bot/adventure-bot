import { CommandInteraction, MessageEmbed } from 'discord.js'

import { Emoji } from '@adventure-bot/Emoji'
import { AttackResult } from '@adventure-bot/attack'
import { attackResultHeadline } from '@adventure-bot/attack/attackResultHeadline'
import { hpBarField } from '@adventure-bot/character/hpBar/hpBarField'
import {
  attackFlavorText,
  attackRollText,
} from '@adventure-bot/commands/attack'

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
        ? `${Emoji(interaction, 'monsterDamageMax')} ${
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
