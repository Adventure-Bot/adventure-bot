import { CommandInteraction } from 'discord.js'

import { findOrCreateCharacter } from '@adventure-bot/game/character'
import {
  angels,
  cairns,
  cave,
  chest,
  coralReef,
  divineBlessing,
  fairyWell,
  monster,
  shop,
  tavern,
  trap,
  travel,
} from '@adventure-bot/game/encounters'
import { randomShrine } from '@adventure-bot/game/encounters/shrine'
import { CommandHandler, weightedTable } from '@adventure-bot/game/utils'

export const randomEncounter = (
  interaction: CommandInteraction
): CommandHandler => {
  const character = findOrCreateCharacter(interaction.user)
  const coralReefChance = character.xp >= 100 ? 1 : 0
  const caveChance = character.xp >= 10 ? 1 : 0
  return weightedTable<() => CommandHandler>([
    [0.2, () => divineBlessing],
    [1, () => angels],
    [1, () => fairyWell],
    [2, () => cairns],
    [1, () => shop],
    [1, () => tavern],
    [caveChance, () => cave],
    [coralReefChance, () => coralReef],
    [1, () => trap],
    [1, () => travel],
    [2, () => monster],
    [2, () => chest],
    [2, randomShrine],
  ])()
}
