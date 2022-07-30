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
import { ranger } from '@adventure-bot/game/encounters/ranger'
import { randomShrine } from '@adventure-bot/game/encounters/shrine'
import { getRoamingMonsters } from '@adventure-bot/game/monster'
import { CommandHandler, weightedTable } from '@adventure-bot/game/utils'

export const randomEncounter = (
  interaction: CommandInteraction
): CommandHandler => {
  const character = findOrCreateCharacter(interaction.user)
  const angelChance = character.quests.healer ? 0 : 0.5
  const coralReefChance = character.xp >= 100 ? 1 : 0
  const caveChance = character.xp >= 10 ? 1 : 0
  const rangerChance = getRoamingMonsters().length > 3 ? 1 : 0
  return weightedTable<() => CommandHandler>([
    [0.2, () => divineBlessing],
    [angelChance, () => angels],
    [1, () => fairyWell],
    [2, () => cairns],
    [1, () => shop],
    [1, () => tavern],
    [caveChance, () => cave],
    [coralReefChance, () => coralReef],
    [rangerChance, () => ranger],
    [1, () => trap],
    [1, () => travel],
    [2, () => monster],
    [2, () => chest],
    [2, randomShrine],
  ])()
}
