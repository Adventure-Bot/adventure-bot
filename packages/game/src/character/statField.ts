import { CommandInteraction, EmbedField } from 'discord.js'

import { Emoji } from '@adventure-bot/game/Emoji'
import { Character, Stat, statTitles } from '@adventure-bot/game/character'
import store from '@adventure-bot/game/store'
import {
  selectCharacterStatModified,
  selectCharacterStatModifier,
} from '@adventure-bot/game/store/selectors'

export function statField(
  character: Character,
  interaction: CommandInteraction,
  stat: Stat
): EmbedField {
  return {
    name: statTitles[stat],
    value: statText({ character, stat, interaction }),
    inline: true,
  }
}
function statText({
  character,
  stat,
}: {
  character: Character
  stat: Stat
  interaction: CommandInteraction
}): string {
  const state = store.getState()
  const modified = selectCharacterStatModified(state, character, stat)
  const modifier = selectCharacterStatModifier(state, character.id, stat)
  const sign = modifier > 0 ? '+' : ''
  return Emoji(stat) + ` ${modified}${modifier ? ` (${sign}${modifier})` : ''}`
}
