import { CommandInteraction, MessageEmbed } from 'discord.js'

import { Emoji } from '@adventure-bot/game/Emoji'
import {
  decoratedName,
  gpGainField,
  xpGainField,
} from '@adventure-bot/game/character'
import { Encounter } from '@adventure-bot/game/encounters'
import store from '@adventure-bot/game/store'
import {
  selectCharacterById,
  selectMonsterById,
} from '@adventure-bot/game/store/selectors'

export function encounterSummaryEmbed({
  encounter,
}: {
  encounter: Encounter
  interaction: CommandInteraction
}): MessageEmbed {
  const embed = new MessageEmbed({})
  const state = store.getState()
  const character = selectCharacterById(state, encounter.characterId)
  if (!character) {
    embed.setTitle(`Character ${encounter.characterId} not found`)
    return embed
  }
  const monster = selectMonsterById(state, encounter.monsterId)
  if (!monster) {
    embed.setTitle(`Monster ${encounter.monsterId} not found`)
    return embed
  }
  embed.setTitle(
    `${decoratedName(character)} encountered ${decoratedName(monster)}!`
  )

  switch (encounter.outcome) {
    case 'double ko':
      embed.addField('Double KO!', `They knocked eachother out!`)
      break
    case 'in progress':
      embed.addField('In Progress', 'Encounter in progress!')
      break
    case 'monster fled':
      embed.addField('Evaded!', Emoji('run') + `${monster.name} escaped!`)
      break
    case 'player defeated':
      embed.addField('Unconscious', `${character.name} was knocked out!`)
      break
    case 'player fled':
      embed.addField('Fled', `${character.name} escaped with their life!`)
      break
    case 'player victory':
      embed.addField(
        'Triumphant!',
        `${character.name} defeated ${monster.name}! 🎉`
      )
      embed.addFields([xpGainField(monster.xpValue)])
      break
  }

  if (encounter.lootResult?.goldTaken) {
    embed.addFields([gpGainField(encounter.lootResult?.goldTaken)])
  }
  const itemsTaken = encounter.lootResult?.itemsTaken
  if (itemsTaken && itemsTaken.length > 0) {
    embed.addField(
      'Items Looted',
      itemsTaken.map((item) => item.name).join(', ')
    )
  }
  embed.setImage(monster.profile).setThumbnail(character.profile)

  return embed
}
