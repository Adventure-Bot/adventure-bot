import { CommandInteraction, MessageEmbed } from 'discord.js'

import { Emoji } from '@adventure-bot/game/Emoji'
import { decoratedName } from '@adventure-bot/game/character'
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
      embed.setTitle(
        `${decoratedName(character)} and ${decoratedName(
          monster
        )} knocked each other out!`
      )
      break
    case 'in progress':
      embed.addField('In Progress', 'Encounter in progress!')
      break
    case 'monster fled':
      embed.setTitle(
        `${decoratedName(monster)} fled from ${decoratedName(character)}!`
      )
      break
    case 'player defeated':
      embed.setTitle(
        `${decoratedName(monster)} knocked ${decoratedName(character)} out!`
      )
      break
    case 'player fled':
      embed.setTitle(
        `${decoratedName(character)} fled from ${decoratedName(monster)}!`
      )
      break
    case 'player victory':
      embed.setTitle(
        `${decoratedName(character)} defeated ${decoratedName(monster)}!`
      )
      break
  }
  return embed
}
