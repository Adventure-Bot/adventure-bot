import { CommandInteraction, EmbedFieldData } from 'discord.js'
import { Emoji } from '@adventure-bot/Emoji'
import store from '@adventure-bot/store'
import { selectCharacterById } from '@adventure-bot/store/selectors'
import { hpBar } from '@adventure-bot/character/hpBar/hpBar'

export function primaryStatFields({
  characterId,
  adjustment = 0,
  interaction,
}: {
  characterId: string
  adjustment?: number
  interaction: CommandInteraction
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
      value: Emoji(interaction, 'xp') + ' ' + character.xp.toString(),
      inline: true,
    },
    {
      name: 'Gold',
      value: Emoji(interaction, 'gold') + ' ' + character.gold.toString(),
      inline: true,
    },
  ]
}
