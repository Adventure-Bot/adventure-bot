import { EmbedFieldData } from 'discord.js'

import { Emoji } from '@adventure-bot/game/Emoji'
import { hpBar } from '@adventure-bot/game/character'
import store from '@adventure-bot/game/store'
import { selectCharacterById } from '@adventure-bot/game/store/selectors'

export function primaryStatFields({
  characterId,
  adjustment = 0,
}: {
  characterId: string
  adjustment?: number
}): EmbedFieldData[] {
  const character = selectCharacterById(store.getState(), characterId)
  if (!character) return []
  return [
    {
      name: 'Health',
      value: `${character.hp}/${character.statsModified.maxHP}\n${hpBar(
        character,
        adjustment
      )}`,
    },
    {
      name: 'Experience',
      value: Emoji('xp') + ' ' + character.xp.toString(),
      inline: true,
    },
    {
      name: 'Gold',
      value: Emoji('gold') + ' ' + character.gold.toString(),
      inline: true,
    },
  ]
}
