import { EmbedFieldData } from 'discord.js'
import { Character } from '@adventure-bot/character/Character'
import { hpBar } from '@adventure-bot/character/hpBar/hpBar'

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
  character: Character
  adjustment?: number
  showName?: boolean
}): EmbedFieldData {
  return {
    name: (showName ? character.name + "'s " : '') + 'HP',
    value: `${hpBar(character, adjustment)} ${numberModifierText(adjustment)}`,
  }
}
