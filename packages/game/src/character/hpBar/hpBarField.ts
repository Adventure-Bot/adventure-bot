import { EmbedField } from 'discord.js'

import { hpBar } from '@adventure-bot/game/character'
import { CharacterWithStats } from '@adventure-bot/game/store/selectors'

const numberModifierText = (num?: number): string => {
  if (!num) return ''
  if (num > 0) return `+${num}`
  if (num < 0) return `${num}`
  return ''
}

export function hpBarField({
  character,
  adjustment = 0,
  showName = false,
}: {
  character: CharacterWithStats
  adjustment?: number
  showName?: boolean
}): EmbedField {
  return {
    name:
      (showName ? character.name + "'s " : '') +
      ` HP: ${character.hp + adjustment}/${character.statsModified.maxHP}`,
    value: `${hpBar(character, adjustment)} ${numberModifierText(adjustment)}`,
    inline: false,
  }
}
