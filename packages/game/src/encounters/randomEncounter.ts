import { CommandInteraction } from 'discord.js'

import { findOrCreateCharacter } from '@adventure-bot/game/character'
import {
  angels,
  cave,
  chest,
  divineBlessing,
  fairyWell,
  monster,
  shop,
  tavern,
  trap,
  travel,
} from '@adventure-bot/game/encounters'
import { cairns } from '@adventure-bot/game/encounters'
import { randomShrine } from '@adventure-bot/game/encounters/shrine'
import { CommandHandler, weightedTable } from '@adventure-bot/game/utils'

export const randomEncounter = (
  interaction: CommandInteraction
): CommandHandler => {
  const character = findOrCreateCharacter(interaction.user)
  const angelChance = character.quests.healer ? 0 : 0.5
  return weightedTable<() => CommandHandler>([
    [0.2, () => divineBlessing],
    [angelChance, () => angels],
    [1, () => fairyWell],
    [2, () => cairns],
    [1, () => shop],
    [1, () => tavern],
    [1, () => cave],
    [1, () => trap],
    [1, () => travel],
    [2, () => monster],
    [2, () => chest],
    [2, randomShrine],
  ])()
}
